const express = require("express"),
      bodyParser = require("body-parser"),
      LocalDBService = require('./services/database-service'),
      scraperService = require('./scraper/scraper-service'),
      app = express();

const port = process.env.PORT || 2323,
      db = new LocalDBService();

app.use('/.well-known', express.static('.well-known'));

app.use(bodyParser.json());
app.use('/scrape', scraperService(db));

app.get('/', (req, res) => res.send("Welcome to the Waukesha County Custard API!  Don't use it!"));

app.listen(port);
console.log(`API started on port ${port}`);