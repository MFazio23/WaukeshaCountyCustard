const KoppsScraper = require('./scrapers/kopps-scraper'),
    OscarsScraper = require('./scrapers/oscars-scraper'),
    MurfsScraper = require('./scrapers/murfs-scraper');

const router = require('express').Router(),
    koppsScraper = new KoppsScraper(),
    oscarsScraper = new OscarsScraper(),
    murfsScraper = new MurfsScraper();

let db;

router.post('/', (req, res, next) => {
    Promise.all([
        koppsScraper.scrape(),
        oscarsScraper.scrape(),
        murfsScraper.scrape()
    ]).then((stores) => {
        let flavorCount = 0;

        let flavors = {};

        //Convert the flavors to a date-first format
        stores.forEach((store) => {
            store.flavorDays.forEach((day) => {
                if (!flavors[day.date]) flavors[day.date] = {};
                flavors[day.date][store.storeName] = day.flavors;
                flavorCount++;
            })
        });

        db.saveFlavors(flavors).then((newFlavors) => {
            res.json({
                "status": "Success",
                "flavorCount": flavorCount,
                "flavors": newFlavors
            });
        });

    });
});

router.post('/kopps', (req, res, next) => {
    koppsScraper.scrape().then((results) => res.json(results));
});
router.post('/oscars', (req, res, next) => {
    oscarsScraper.scrape().then((results) => res.json(results));
});
router.post('/murfs', (req, res, next) => {
    murfsScraper.scrape().then((results) => res.json(results));
});

module.exports = (database) => {
    db = database;

    return router;
};