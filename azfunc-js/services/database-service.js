const
    Utils = require("../utils/general-utils"),
    fbAdmin = require('firebase-admin'),
    request = require('request'),
    serviceAccount = require('../service-account-key.json');

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

    saveFlavors(flavorDays) {
        return new Promise((res, rej) => {
            this.getFlavors().then((currentFlavors) => {
                const newFlavors = Utils.mergeDeep({}, flavorDays, currentFlavors);
                const flavorDBRef = this.db.ref('flavors');
                flavorDBRef.update(newFlavors).then((result) => res(newFlavors));
            });
        });
    }
}

module.exports = DatabaseService;