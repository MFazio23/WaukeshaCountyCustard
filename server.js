const express = require("express"),
      bodyParser = require("body-parser"),
      LocalDBService = require('./services/database-service'),
      scraperService = require('./scraper/scraper-service'),
      apiService = require('./services/api-service'),
      alexaHandler = require('./handlers/alexa-handler'),
      dialogflowHandler = require('./handlers/dialogflow-handler'),
      verifier = require('alexa-verifier-middleware'),
      app = express();

const port = process.env.PORT || 2323,
      db = new LocalDBService();

//app.use(verifier);
app.use(bodyParser.json());

app.use('/scrape', scraperService(db));
app.use('/api', apiService(db));

const alexaRouter = express.Router();
app.use('/webhook/alexa', alexaRouter);
alexaRouter.post('/', alexaHandler(db));

app.post('/webhook/dialogflow', dialogflowHandler(db));
app.post('/dialogflow/webhook', dialogflowHandler(db));

app.get('/', (req, res) => res.send("Welcome to the Waukesha County Custard API!  Don't use it!"));

app.listen(port);
console.log(`API started on port ${port}`);