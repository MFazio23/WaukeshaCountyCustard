const flavorUtils = require('../utils/flavor-utils');
const responseUtils = require('../utils/response-utils');
const staticResponse = require('../services/static-response-service');
const storeUtils = require('../utils/store-utils');
const moment = require('moment-timezone');

const {
    dialogflow
} = require('actions-on-google');

moment.tz.setDefault("America/Chicago");

let db;

const respond = (app, response, end, noQuestion) => {
    if (!response) {
        response = `I'm sorry, I'm having trouble processing your request.`;
        if (end) app.close(response);
        else app.ask(`${response}  Please try again.`);
    } else {
        if (end) {
            app.close(response);
        } else {
            if (typeof(response) === 'string') {
                app.ask(`${response}${noQuestion ? '' : `  ${responseUtils.getEndingQuestion()}`}`);
            } else {
                if(response.context) {
                    app.contexts.set(response.context.name, 1, {value: response.context.value});
                }
                app.ask(`${response.text}${noQuestion ? '' : `  ${responseUtils.getEndingQuestion()}`}`);
                if(response.gaResponse) app.ask(response.gaResponse);
            }
        }
    }
};

const flavors = conv => {
    const params = conv.parameters || {};
    const date = params.date ? moment(params.date) : moment();
    const store = params.store;
    return db.getFlavorsForDate(date, store).then((flavors) => {
        if (!flavors) respond(conv, "We are having trouble finding the flavors.  Please try again later!", true);
        const flavorStatement = flavorUtils.convertFlavorsToAssistantResponse(flavors, date);
        respond(conv, flavorStatement);
    });
};

const stores = conv => {
    const params = conv.parameters || {};
    const store = params.store;
    const city = params.city;

    return db.getStores(store, city).then((stores) => {
        if (!stores || stores.locationCount === 0) {
            respond(conv, `I'm sorry, I couldn't find any ${store ? storeUtils.getProperStoreName(store) : 'stores'}${city ? ` in ${city}` : ''}.`);
        }
        const storeStatement = storeUtils.convertStoresToAssistantResponse(stores, store, city);
        respond(conv, storeStatement);
    }).catch((err) => respond(conv, `I'm sorry, I couldn't find any ${store ? storeUtils.getProperStoreName(store) : 'stores'}${city ? ` in ${city}` : ''}.`));
};

const hours = conv => {
    const params = conv.parameters || {};
    const store = params.store;
    const city = params.city;

    if (!store) conv.ask("Please try again with a store name.");

    return db.getStores(store, city).then((stores) => {
        if (!stores || stores.locationCount === 0) {
            respond(conv, `I'm sorry, I couldn't find any ${store ? storeUtils.getProperStoreName(store) : 'stores'}${city ? ` in ${city}` : ''}.`);
        }
        const storeStatement = storeUtils.convertStoreHoursToAssistantResponse(stores, store, city);
        respond(conv, storeStatement);
    }).catch((err) => respond(conv, `I'm sorry, I couldn't find any ${store ? storeUtils.getProperStoreName(store) : 'stores'}${city ? ` in ${city}` : ''}.`));
};

const fallback = conv => {
    db.addMisunderstoodInput(conv.query);
    respond(conv, staticResponse.getUnknownResponse(), false, true);
};

module.exports = (database) => {
    db = database;
    const app = dialogflow();

    app.intent('Flavors', flavors);
    app.intent('Stores', stores);
    app.intent('Hours', hours);
    app.intent('Default Fallback Intent', fallback);

    return app;
};