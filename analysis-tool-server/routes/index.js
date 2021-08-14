const router = require('express').Router();

const matchRouter = require('./match');
const annotationRouter = require('./annotate');

// match router
router.use('/match', matchRouter);

// annotation router
router.use('/annotate', annotationRouter);

// default catch-all route
router.all('*', (req, res, next) => {
    res.status(404).json('Error: PAGE NOT FOUND');
});

module.exports = router;
