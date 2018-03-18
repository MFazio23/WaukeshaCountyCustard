const StringUtils = require('../../utils/string-utils');
const BaseScraper = require('./base-scraper');
const moment = require('moment-timezone');

moment.tz.setDefault("America/Chicago");

class OscarsScraper extends BaseScraper {
    constructor() {
        super();
        this.url = "http://oscarscustard.com/flavors.html";
        this.storeName = "oscars";
    }

    parseContent($) {
        const todayNameBlock = $("p span.style3").first();
        const todaysName = todayNameBlock.text().trim();
        const today = todayNameBlock.parent('p').text().trim().replace(/\n[ ]+/gi, ' ');
        const todaysDescription = today.replace(todaysName, '').trim();

        const month = $(".style11").text();
        let mp = $(".style2").map((ind, flavorDate) => {
            const $fd = $(flavorDate);
            const dayOfMonth = $fd.find('b').text();

            if (!dayOfMonth) return null;

            return {
                date: moment(`${month} ${dayOfMonth}`, "MMMM D").format("YYYYMMDD"),
                flavors: $fd.find('.flavor').map((ind, flavor) => {
                    const $flavor = $(flavor),
                        flavorName = StringUtils.autocase($flavor.text().trim());
                    if (!flavorName) return null;
                    let result = {
                        flavorName: flavorName
                    };
                    if (!todaysName.includes("-or-") && todaysName.toUpperCase() === flavorName.toUpperCase()) result['flavorDescr'] = todaysDescription;
                    return result;
                }).get()
            };
        });

        return mp.get();
    }
}

module.exports = OscarsScraper;