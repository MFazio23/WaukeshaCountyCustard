const KoppsScraper = require('../scrapers/kopps-scraper'),
      OscarsScraper = require('../scrapers/oscars-scraper');

const router = require('express').Router(),
      koppsScraper = new KoppsScraper(),
      oscarsScraper = new OscarsScraper();

let db;

router.post('/', (req, res, next) => {
    Promise.all([koppsScraper.scrape(), oscarsScraper.scrape()]).then((flavors) => {
        const flavorCount = db.saveFlavors({
            "Kopps": flavors[0],
            "Oscars": flavors[1]
        });

        res.json({
            "status": "Success",
            "flavors": flavorCount
        });
    });
});

module.exports = (database) => {
    db = database;

    return router;
};