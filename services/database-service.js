const
    Utils = require("../utils/general-utils"),
    moment = require('moment-timezone'),
    request = require('request'),
    fbAdmin = require('firebase-admin'),
    serviceAccount = require('../service-account-key.json');

moment.tz.setDefault("America/Chicago");

class DatabaseService {
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
                    res(store ? {[store]: response} : response);
                } else {
                    rej(err || `No flavors were found${store ? ' for' + store : ''} on ${date}.`);
                }
            });
        });
    }

    getTodaysFlavors() {
        return this.getFlavorsForDate(moment());
    }

    getStores(store, city) {
        return new Promise((res, rej) => {
            let locationCount = 0;
            let url = `${this.dbUrl}/stores`;
            if (store) url += `/${store}`;
            url += '.json';
            request(url, (err, resp, storesJson) => {
                if (!err && storesJson && storesJson !== 'null') {
                    const stores = store ? {[store]: JSON.parse(storesJson)} : JSON.parse(storesJson);
                    let newStores = {};

                    if (!city) {
                        newStores = stores;
                    }
                    Object.keys(stores).forEach((key) => {
                        const store = stores[key];
                        if (city) {
                            const location = store.locations[city.toLowerCase()];
                            if (location) {
                                store.locations = {};
                                store.locations[city.toLowerCase()] = location;
                                newStores[key] = store;
                                locationCount++;
                            }
                        } else {
                            locationCount += Object.keys(store.locations).length;
                        }
                    });
                    newStores.locationCount = locationCount;
                    res(newStores);
                } else {
                    rej();
                }
            });
        });
    }

    addMisunderstoodInput(input) {
        return new Promise((res, rej) => {
            const miDb = this.db.ref(`misunderstoodInput/${moment().format("YYYYMMDDHHmmss")}`);
            miDb.set({input: input}).then((result) => res(response));
        });
    }
}

module.exports = DatabaseService;