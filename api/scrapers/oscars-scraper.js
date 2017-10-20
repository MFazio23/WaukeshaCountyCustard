const BaseScraper = require('./base-scraper');
const moment = require('moment');

class OscarsScraper extends BaseScraper {
    constructor() {
        super();
        this.url = "http://oscarscustard.com/flavors.html";
    }

    parseContent($) {
        const month = $(".style11").text();
        let mp = $(".style2").map((ind, flavorDate) => {
            const $fd = $(flavorDate);
            const dayOfMonth = $fd.find('b').text();

            if(!dayOfMonth) return null;

            return {
                date: moment(`${month} ${dayOfMonth}`, "MMMM D").format("YYYYMMDD"),
                flavors: $fd.find('.flavor').map((ind, flavor) => {
                    const $flavor = $(flavor),
                          flavorName = $flavor.text().trim();
                    if(!flavorName) return null;
                    return {
                        flavorName: flavorName
                    };
                }).get()
            };
        });

        return mp.get();
    }
}

module.exports = OscarsScraper;