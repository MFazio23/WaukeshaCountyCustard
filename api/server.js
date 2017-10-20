const express = require("express"),
      LocalDBService = require('./db/local-db-service'),
      scraperService = require('./services/scraper-service'),
      apiService = require('./services/api-service'),
      app = express();

const port = process.env.PORT || 2323,
      db = new LocalDBService();

app.use('/scrape', scraperService(db));
app.use('/api', apiService(db));

app.listen(port);
console.log(`API started on port ${port}`);