const Alexa = require('alexa-sdk');
const staticResponse = require('../services/static-response-service');
const flavorUtils = require('../utils/flavor-utils');
const generalUtils = require('../utils/general-utils');
const responseUtils = require('../utils/response-utils');
const storeUtils = require('../utils/store-utils');

let db;

const respond = function(emit, response, end) {
    if(!response) {
        response = `I'm sorry, I'm having trouble processing your request.`;
        if(end) emit(':tell', response);
        else emit(':ask', `${response}  Please try again.`);
    }
    if(end) {
        emit(':tell', response);
    } else {
        emit(':ask', `${response}  ${responseUtils.getEndingQuestion()}`);
    }
};

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', staticResponse.getWelcomeResponse());
    },
    'About': function() {
        this.emit(':ask', staticResponse.getAboutResponse());
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', staticResponse.getGoodbyeResponse());
    },
    'Flavors': function() {
        const intent = this.event.request.intent;
        const date = intent.slots.date.value;
        const store = generalUtils.getAlexaSlotId(intent.slots.store);

        db.getFlavorsForDate(date, store).then((flavors) => {
            if(!flavors) respond(this.emit, "We are having trouble finding the flavors.  Please try again later!", true);
            const flavorStatement = flavorUtils.convertFlavorsToAssistantResponse(flavors, date);
            respond(this.emit, flavorStatement);
        }).catch((err) => {
            setImmediate(() => {
                console.error("Exception with flavors:", err, store, date);
                respond(this.emit, "We are having trouble finding the flavors.  Please try again later!", true);
            });
        });
    },
    'Help': function() {
        this.emit(':ask', staticResponse.getHelpResponse());
    },
    'Hours': function() {
        const intent = this.event.request.intent;
        const city = intent.slots.city.value;
        const store = generalUtils.getAlexaSlotId(intent.slots.store);

        if(!store) respond(this.emit, "Please try again with a store name.");

        db.getStores(store, city).then((stores) => {
            if(!stores || stores.locationCount === 0){
                respond(this.emit, `I'm sorry, I couldn't find any ${store && storeUtils.getProperStoreName(store) ? storeUtils.getProperStoreName(store) : 'stores'}${city ? ` in ${city}` : ''}.`);
            }
            const storeStatement = storeUtils.convertStoreHoursToAssistantResponse(stores, store, city);
            respond(this.emit, storeStatement);
        }).catch((err) => {
            setImmediate(() => {
                console.error("Exception with hours:", err, store, city);
                respond(this.emit, `I'm sorry, I couldn't find any ${store && storeUtils.getProperStoreName(store) ? storeUtils.getProperStoreName(store) : 'stores'}${city ? ` in ${city}` : ''}.`);
            });
        });
    },
    'Stores': function() {
        const intent = this.event.request.intent;
        const city = intent.slots.city.value;
        const store = generalUtils.getAlexaSlotId(intent.slots.store);

        db.getStores(store, city).then((stores) => {
            if(!stores || stores.locationCount === 0) {
                respond(this.emit, `I'm sorry, I couldn't find any ${store && storeUtils.getProperStoreName(store) ? storeUtils.getProperStoreName(store) : 'stores'}${city ? ` in ${city}` : ''}.`);
            }
            const storeStatement = storeUtils.convertStoresToAssistantResponse(stores, store, city);
            respond(this.emit, storeStatement);
        }).catch((err) => {
            setImmediate(() => {
                console.error("Exception with stores:", err, store, city);
                respond(this.emit, `I'm sorry, I couldn't find any ${store && storeUtils.getProperStoreName(store) ? storeUtils.getProperStoreName(store) : 'stores'}${city ? ` in ${city}` : ''}.`);
            });
        });
    },
    'Unhandled': function() {
        this.emit(':ask', staticResponse.getUnknownResponse());
    }
};

module.exports = (database) => {
    db = database;

    return (req, res) => {
        const context = {
            succeed: function(result) {
                res.json(result);
            },
            fail: function(error) {
                console.error("Failed", error);
            }
        };

        const alexa = Alexa.handler(req.body, context);
        alexa.appId = "amzn1.ask.skill.bc2fda07-e4b2-40d4-9731-ae825e8008fc";
        alexa.registerHandlers(handlers);
        alexa.execute();
    }
};