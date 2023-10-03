const router = require('express').Router();

const matchRouter = require('./match');
const videoRouter = require('./video');
const annotationRouter = require('./annotate');

// index route
router.get('/', (req, res) => {
  res.status(200).json('OK');
});

// match router
router.use('/match', matchRouter);

// video router
router.use('/video', videoRouter);

// annotation router
router.use('/annotate', annotationRouter);

module.exports = router;
