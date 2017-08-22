const express = require("express"),
    app = express(),
    KoppsScraper = require('./scrapers/kopps-scraper');

const koppsScraper = new KoppsScraper();

const port = process.env.PORT || 2323;

app.get('/scrape', (req, res) => {
    koppsScraper.scrape().then((flavors) => {
        res.json(flavors);
    });

});

app.listen(port);
console.log(`API started on port ${port}`);