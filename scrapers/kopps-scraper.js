const BaseScraper = require('./base-scraper');
const moment = require('moment');

class KoppsScraper extends BaseScraper {
    constructor() {
        super();
        this.url = "https://www.kopps.com/flavor-forecast";
        this.storeName = "kopps";
    }

    parseContent($) {
        let mp = $(".flavor-forecast").map((ind, flavor) => {
            const $flavor = $(flavor);

            return {
                date: moment($flavor.find('h5').text(), "ddd M/DD").format("YYYYMMDD"),
                flavors: $flavor.find('.col-3').map((ind, flavor) => {
                    const $flavor = $(flavor);
                    return {
                        imgUrl: $flavor.find('.flavor-circle img').prop('src'),
                        flavorName: $flavor.find('.flavor-of-day').text(),
                        flavorDescr: $flavor.find('p').text()
                    };
                }).get()
            };
        });

        return mp.get();
    }
}

module.exports = KoppsScraper;