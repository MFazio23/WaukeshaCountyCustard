const request = require('request');
const cheerio = require('cheerio');

class BaseScraper {

    constructor() {
        this.url = "N/A";
    }

    scrape() {
        return new Promise((res, rej) => {
            request(this.url, (err, resp, html) => {
                if (!err) {
                    res(this.parseContent(cheerio.load(html)));
                }
            });
        });
    }

    parseContent($) {
        console.error("parseContent needs to be implemented.");
    }
}

module.exports = BaseScraper;