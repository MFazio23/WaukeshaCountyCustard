const Loki = require('lokijs'),
    moment = require('moment');

class LocalDBService {

    constructor() {
        this.dbPath = "flavors.json";
        this.collections = [
            "Kopps",
            "Oscars"
        ];
        this.db = new Loki(this.dbPath);

        this.collections.forEach((collection) => {
            if(!this.db.getCollection(collection)) {
                console.log("Adding new collection: " + collection);
                this.db.addCollection(collection);
            }
        });
    }

    saveFlavors(flavorCollections) {
        let flavorCount = 0;

        this.collections.forEach((col) => {
            const collection = this.db.getCollection(col);
            collection.clear();

            const flavors = flavorCollections[col];
            collection.insert(flavors);

            flavorCount += collection.count();
        });

        return flavorCount;
    }

    getFlavors(criteria) {
        let flavors = {count: 0};

        this.collections.forEach((col) => {
            const collection = this.db.getCollection(col);
            flavors[col] = collection.find(criteria);
            flavors.count += collection.count();
        });

        return flavors;
    }

    getTodaysFlavors() {
        return this.getFlavors({date: {'$eq': moment().format('YYYYMMDD')}});
    }
}

module.exports = LocalDBService;