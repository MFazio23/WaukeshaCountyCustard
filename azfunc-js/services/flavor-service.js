const KoppsScraper = require("../scrapers/kopps-scraper"),
    OscarsScraper = require("../scrapers/oscars-scraper"),
    MurfsScraper = require("../scrapers/murfs-scraper"),
    LeDucsScraper = require("../scrapers/leducs-scraper"),
    LocalDBService = require("../services/database-service");

const koppsScraper = new KoppsScraper(),
    oscarsScraper = new OscarsScraper(),
    murfsScraper = new MurfsScraper(),
    leDucsScraper = new LeDucsScraper();

module.exports = async function () {
    const db = new LocalDBService();

    const stores = await Promise.all([
        koppsScraper.scrape(),
        oscarsScraper.scrape(),
        murfsScraper.scrape(),
        leDucsScraper.scrape()
    ]);

    let flavorCount = 0;

    let flavors = {};

    //Convert the flavors to a date-first format
    stores.forEach((store) => {
        store.flavorDays.forEach((day) => {
            if (!flavors[day.date]) flavors[day.date] = {};
            flavors[day.date][store.storeName] = day.flavors;
            flavorCount++;
        });
    });

    const newFlavors = await db.saveFlavors(flavors);

    return {
        flavorCount,
        flavors: newFlavors,
    };
};
