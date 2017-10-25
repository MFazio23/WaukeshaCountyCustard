const
    StoreUtils = require("../utils/store-utils"),
    Utils = require("../utils/general-utils"),
    moment = require('moment'),
    request = require('request'),
    fbAdmin = require('firebase-admin'),
    serviceAccount = require('../db/service-account-key.json');

class LocalDBService {
    constructor() {
        this.dbUrl = "https://waukeshacountycustard.firebaseio.com";
        this.dateFormat = "YYYYMMDD";

        fbAdmin.initializeApp({
            credential: fbAdmin.credential.cert(serviceAccount),
            databaseURL: this.dbUrl
        });

        this.db = fbAdmin.database();
    }

    saveFlavors(flavorDays) {
        return new Promise((res, rej) => {
            this.getFlavors().then((currentFlavors) => {
                const newFlavors = Utils.mergeDeep({}, flavorDays, currentFlavors);
                const flavorDBRef = this.db.ref('flavors');
                flavorDBRef.update(newFlavors).then((result) => res(newFlavors));
            });
        });
    }

    getFlavors() {
        return new Promise((res, rej) => {
            request(`${this.dbUrl}/flavors.json`, (err, resp, flavors) => {
                if (!err) {
                    res(JSON.parse(flavors));
                } else {
                    rej(err);
                }
            });
        });
    }

    getFlavorsForDate(date, store) {
        const mDate = (date ? moment(date) : moment()).format(this.dateFormat);
        return new Promise((res, rej) => {
            const url = store ? `${this.dbUrl}/flavors/${mDate}/${store}.json` : `${this.dbUrl}/flavors/${mDate}.json`;
            request(url, (err, resp, flavors) => {
                if (!err && flavors) {
                    let response = JSON.parse(flavors);
                    res(store ? {[StoreUtils.getProperStoreName(store)]: response} : response);
                } else {
                    rej(err || `No flavors were found${store ? ' for' + store : ''} on ${date}.`);
                }
            });
        });
    }

    getTodaysFlavors() {
        return this.getFlavorsForDate(moment());
    }
}

module.exports = LocalDBService;