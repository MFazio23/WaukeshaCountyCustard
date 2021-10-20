const BaseScraper = require('./base-scraper');
const moment = require('moment-timezone');

moment.tz.setDefault("America/Chicago");

class OscarsScraper extends BaseScraper {
    constructor() {
        super();
        this.url = "http://www.oscarscustard.com/index.php/flavors/";
        this.storeName = "oscars";
    }

    parseContent($) {
        const flavorList = $("tbody.wpsm-tbody tr");
        const month = $("div.et_pb_text_inner h2:not(:has(span))").text().replace(" FLAVORS", "");

        return flavorList.map((ind, flavorRow) => {
            const flavorCells = $(flavorRow).find('td');

            const dayOfMonth = flavorCells.first().text().trim().replace(/\D+/gi, ""),
                  flavorNames = flavorCells.last().text().trim();

            return {
                date: moment(`${month} ${dayOfMonth}`, "MMMM D").format("YYYYMMDD"),
                flavors: flavorNames.split(" -or- ").map((name, nameInd) => {
                    return { flavorName: name }
                })
            }
        }).get();

        /*const todayNameBlock = $("p span.style3").first();
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

        return mp.get();*/
    }
}

module.exports = OscarsScraper;