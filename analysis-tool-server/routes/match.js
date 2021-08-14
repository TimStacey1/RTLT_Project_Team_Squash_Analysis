const router = require('express').Router();

const validateRequest = require('./validators/validateRequest');

const matchValidator = require('./validators/matchValidators');

const matchController = require('../controllers/match.controllers');


// route for the creation of a new match
router.post('/new',
    matchValidator.validateMatch(),
    validateRequest,
    matchController.create
);


// route for retrieving all matches
router.get('/all',
    matchController.all
);


// route for editing an existing match 
router.post('/update',
    matchController.update
);


// route for getting a single match
router.get('/get',
    matchController.get
);

module.exports = router;
