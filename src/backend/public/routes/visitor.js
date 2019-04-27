var router = require('express').Router();
var visitorController = require('../apiController/visitorController')

router.get('/detail', visitorController.getDetailNews);

router.post('/get-news', visitorController.getNews);

router.get('/get-pin-news', visitorController.getPinNews);


module.exports = router;