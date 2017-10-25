const request = require('request');
const cheerio = require('cheerio');

class BaseScraper {

    constructor() {
        this.url = "N/A";
        this.storeName = "N/A";
    }

    scrape() {
        return new Promise((res, rej) => {
            request(this.url, (err, resp, html) => {
                if (!err) {
                    let flavorDays = this.parseContent(cheerio.load(html));
                    res({
                        "storeName": this.storeName,
                        "flavorDays": flavorDays
                    });
                }
            });
        });
    }

    parseContent($) {
        console.error("parseContent needs to be implemented.");
    }

    findAndGetText(baseElement, query) {
        //$block.find('.weeklyDateDay').text().trim()
        let text = baseElement.find(query).text();
        if(text) text = text.trim();
        return text;
    }
}

module.exports = BaseScraper;