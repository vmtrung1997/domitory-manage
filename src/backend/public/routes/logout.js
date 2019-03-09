var router = require('express').Router();
var logout = require('../apiController/logOutController')

router.get('/', logout.logout);

module.exports = router;