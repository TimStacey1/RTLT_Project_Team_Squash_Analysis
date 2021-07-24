const router = require('express').Router();

const matchRouter = require('./match');
const annotationRouter = require('./annotate');

// match router
router.use('/match', matchRouter);

// annotation router
router.use('/annotate', annotationRouter);

module.exports = router;
