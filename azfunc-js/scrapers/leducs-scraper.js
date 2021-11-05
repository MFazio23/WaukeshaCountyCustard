const BaseScraper = require('./base-scraper');
const moment = require('moment-timezone');
const request = require("request");

moment.tz.setDefault("America/Chicago");

class LeDucsScraper extends BaseScraper {
    constructor() {
        super();

        this.url = `https://leducscustard.com/wp-admin/admin-ajax.php?action=WP_FullCalendar&type=event&category=3&_=${new Date().getTime()}`;
        this.storeName = "leducs";
        this.dateFormat = 'YYYYMMDD';
    }

    scrape() {
        return new Promise((res, rej) => {
            request(this.url, (err, resp, result) => {
                if (!err) {
                    const flavorDays = this.parseContent(result);
                    res({
                        "storeName": this.storeName,
                        "flavorDays": flavorDays
                    });
                }
            });
        });
    }

    parseContent(content) {
        const rawFlavors = JSON.parse(content);

        return rawFlavors.map(flavor => ({
            date: flavor.start.replace(/T.+/i, "").replace(/-/g, ""),
            flavors: [{
                flavorName: flavor.title
            }]
        }));
    }
}

module.exports = LeDucsScraper;