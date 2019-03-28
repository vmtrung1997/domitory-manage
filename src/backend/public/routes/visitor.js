var router = require('express').Router();
var visitorController = require('../apiController/visitorController')

router.get('/detail', visitorController.getNews);

module.exports = router;