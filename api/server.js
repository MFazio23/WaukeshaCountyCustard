const express = require("express"),
      bodyParser = require("body-parser"),
      LocalDBService = require('./db/local-db-service'),
      scraperService = require('./services/scraper-service'),
      apiService = require('./services/api-service'),
      webhookService = require('./services/webhook/webhook-service'),
      app = express();

const port = process.env.PORT || 2323,
      db = new LocalDBService();

app.use(bodyParser.json());

app.use('/scrape', scraperService(db));
app.use('/api', apiService(db));

app.post('/webhook', webhookService(db));

app.listen(port);
console.log(`API started on port ${port}`);