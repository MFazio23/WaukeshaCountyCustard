const router = require('express').Router();

let db;

router.get('/flavors', (req, res, next) => {
    db.getFlavors().then((flavors) => res.json(flavors));
});
router.get('/flavors/today', (req, res, next) => {
    db.getTodaysFlavors().then((flavors) => res.json(flavors));
});
router.get('/flavors/:date', (req, res, next) => {
    db.getFlavorsForDate(req.params.date).then((flavors) => res.json(flavors));
});
router.get('/stores', (req, res, next) => {
    db.getStores(req.query.store, req.query.city).then((stores) => res.json(stores));
});

module.exports = (database) => {
    db = database;

    return router;
};