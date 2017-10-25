const BaseScraper = require('./base-scraper');
const moment = require('moment');

class MurfsScraper extends BaseScraper {
    constructor() {
        super();
        this.url = "http://www.murfsfrozencustard.com/flavorForecast";
        this.storeName = "murfs";
        this.dateFormat = 'YYYYMMDD';
    }

    parseContent($) {
        let flavors = [];

        let fotd = $("#flavorOfTheDayTop");
        let fotdDateString = fotd.find(".subDateSpan").text().trim();
        let fotdDate = moment(fotdDateString, 'dddd, MMM. DD');

        flavors.push({
            date: fotdDate.format(this.dateFormat),
            flavors: [{
                imgUrl: $(fotd.find('.flavorOfDayImg img')[1]).prop('src'),
                flavorName: this.findAndGetText(fotd, '.flavorOfDayWhiteSpan'),
                flavorDescr: this.findAndGetText(fotd, '.flavorDescriptionSpan')
            }]
        });

        $(".weeklyFlavorBlock").each((ind, block) => {
            const $block = $(block);
            const date = moment(`${this.findAndGetText($block, '.weeklyDateDay')} ${this.findAndGetText($block, '.weeklyDateNumber')}`, 'ddd DD').format(this.dateFormat);
            flavors.push({
                date: date,
                flavors: [{
                    imgUrl: $block.find('.weeklyFlavorImage img').prop('src'),
                    flavorName: this.findAndGetText($block, '.weeklyFlavorName'),
                    flavorDescr: this.findAndGetText($block, '.weeklyFlavorDescription')
                }]
            });
        }).get();

        $(".monthFlavorListing").each((ind, block) => {
            const $block = $(block);
            const date = moment(`${this.findAndGetText($block, '.monthFlavorDay')} ${this.findAndGetText($block, '.monthFlavorDayNum')}`, 'ddd DD').format(this.dateFormat);
            flavors.push({
                date: date,
                flavors: [{
                    imgUrl: $block.find('.monthFlavorImage img').prop('src'),
                    flavorName: this.findAndGetText($block, '.monthFlavorHeadline'),
                    flavorDescr: this.findAndGetText($block, '.monthFlavorSub')
                }]
            });
        }).get();

        return flavors;
    }
}

module.exports = MurfsScraper;