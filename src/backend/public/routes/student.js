var router = require('express').Router();
var studentController = require('../apiController/studentController')

router.get('/', studentController.get);

module.exports = router;