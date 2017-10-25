const flavorUtils = require('../../utils/flavor-utils');
const responseUtils = require('../../utils/response-utils');
const moment = require('moment');
const DialogflowApp = require('actions-on-google').DialogflowApp;

let db, app;

respond = (app, response, end) => {
    if(end) {
        app.tell(response);
    } else {
        app.ask(`${response}  ${responseUtils.getEndingQuestion()}`);
    }
};

flavors = (app) => {
    const date = moment(app.getArgument("date"));
    const store = app.getArgument("store");
    db.getFlavorsForDate(date, store).then((flavors) => {
        if(!flavors) respond(app, "We are having trouble finding the flavors.  Please try again later!", true);
        const flavorStatement = flavorUtils.convertFlavorsToDialogflowResponse(flavors, date);
        respond(app, flavorStatement);
    });
};

locations = (app) => {
    const store = app.getArgument("store");
    const city = app.getArgument("city");
    respond(app, `The store was ${store} and the city was ${city}`)
   /* db.getLocationsByStoreAndCity(store, city).then((locations) => {
        /!*const flavorStatement = flavorUtils.convertFlavorsToDialogflowResponse(flavors, date);
        respond(app, flavorStatement);*!/
    });*/
};



module.exports = (database) => {
    db = database;

    return (req, res) => {
        app = new DialogflowApp({request: req, response: res});

        let actionMap = new Map();
        actionMap.set('flavors', flavors);
        actionMap.set('locations', locations);

        app.handleRequest(actionMap);
    }
};