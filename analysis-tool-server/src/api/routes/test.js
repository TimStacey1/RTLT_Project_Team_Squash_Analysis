const router = require('express').Router();

// Connect routes to controllers
// e.g. router.get('/', myControllerFunction);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

/* GET users listing. */
router.get('/user', function (req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;