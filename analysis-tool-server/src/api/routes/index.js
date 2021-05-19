const router = require('express').Router();
const testRoute = require('./test');

// Import all routes here
// export as router for server.js
router.use(testRoute); 

module.exports = router;