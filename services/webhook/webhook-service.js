const flavorUtils = require('../../utils/flavor-utils');
const responseUtils = require('../../utils/response-utils');
const storeUtils = require('../../utils/store-utils');
const moment = require('moment-timezone');
const DialogflowApp = require('actions-on-google').DialogflowApp;

moment.tz.setDefault("America/Chicago");

let db, app;

respond = (app, response, end) => {
    if(!response) {
        response = `I'm sorry, I'm having trouble processing your request.`;
        if(end) app.tell(response);
        else app.ask(`${response}  Please try again.`);
    }
    if(end) {
        app.tell(response);
    } else {
        app.ask(`${response}  ${responseUtils.getEndingQuestion()}`);
    }
};

flavors = (app) => {
    const date = app.getArgument("date") ? moment(app.getArgument("date")) : moment();
    const store = app.getArgument("store");
    db.getFlavorsForDate(date, store).then((flavors) => {
        if(!flavors) respond(app, "We are having trouble finding the flavors.  Please try again later!", true);
        const flavorStatement = flavorUtils.convertFlavorsToDialogflowResponse(flavors, date);
        respond(app, flavorStatement);
    });
};

stores = (app) => {
    const store = app.getArgument("store");
    const city = app.getArgument("city");

    db.getStores(store, city).then((stores) => {
        if(!stores || stores.locationCount === 0){
            respond(app, `I'm sorry, I couldn't find any ${store ? storeUtils.getProperStoreName(store) : 'stores'}${city ? ` in ${city}` : ''}.`);
        }
        const storeStatement = storeUtils.convertStoresToDialogflowResponse(stores, store, city);
        respond(app, storeStatement);
    }).catch((err) => respond(app, `I'm sorry, I couldn't find any ${store ? storeUtils.getProperStoreName(store) : 'stores'}${city ? ` in ${city}` : ''}.`));
};

hours = (app) => {
    const store = app.getArgument("store");
    const city = app.getArgument("city");

    if(!store) app.ask("Please try again with a store name.");

    db.getStores(store, city).then((stores) => {
        if(!stores || stores.locationCount === 0){
            respond(app, `I'm sorry, I couldn't find any ${store ? storeUtils.getProperStoreName(store) : 'stores'}${city ? ` in ${city}` : ''}.`);
        }
        const storeStatement = storeUtils.convertStoreHoursToDialogflowResponse(stores, store, city);
        respond(app, storeStatement);
    }).catch((err) => respond(app, `I'm sorry, I couldn't find any ${store ? storeUtils.getProperStoreName(store) : 'stores'}${city ? ` in ${city}` : ''}.`));

    //respond(app, "This is not yet implemented.");
};

module.exports = (database) => {
    db = database;

    return (req, res) => {
        app = new DialogflowApp({request: req, response: res});

        let actionMap = new Map();
        actionMap.set('flavors', flavors);
        actionMap.set('stores', stores);
        actionMap.set('hours', hours);

        app.handleRequest(actionMap);
    }
};