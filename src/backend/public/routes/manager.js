var router = require('express').Router();
var quanLyController = require('../apiController/expenseController')



router.get('/expense', quanLyController.quan_ly_dien_nuoc);

module.exports = router;