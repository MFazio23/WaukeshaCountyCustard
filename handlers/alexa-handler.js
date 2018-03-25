const Alexa = require('alexa-sdk');

let db;

module.exports = (database) => {
    db = database;
};