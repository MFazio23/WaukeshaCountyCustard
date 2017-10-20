const router = require('express').Router();

let db;

router.get('/flavors', (req, res, next) => {
    res.json(db.getFlavors());
});
router.get('/flavors/today', (req, res, next) => {
    res.json(db.getTodaysFlavors());
});

module.exports = (database) => {
    db = database;

    return router;
};