const router = require('express').Router();

const annotationRouter = require('./annotate');

// annotation router
router.use('/annotate', annotationRouter); 

module.exports = router;
