var router = require('express').Router();
var expenseController = require('./../apiController/expenseController')
var activityController = require('./../apiController/activityController')



router.get('/expense', expenseController.quan_ly_dien_nuoc);

router.post('/expense/get_expense_table', expenseController.select_expense_table);

router.get('/expense/refresh', expenseController.refresh_data);

router.get('/activity/get_activity', activityController.get_activity);

module.exports = router;