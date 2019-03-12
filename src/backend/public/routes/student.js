var router = require('express').Router();
var studentController = require('../apiController/studentController')

router.get('/get-info', studentController.getInfo);

router.get('/', studentController.a)
module.exports = router;