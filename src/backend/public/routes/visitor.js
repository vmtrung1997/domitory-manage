var router = require('express').Router();
var visitorController = require('../apiController/visitorController')

router.get('/detail', visitorController.getDetailNews);

router.get('/get-news', visitorController.getNews);

module.exports = router;