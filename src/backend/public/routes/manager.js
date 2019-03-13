var router = require('express').Router();
var expenseController = require('../apiController/expenseController')

var infoStudent = require('../apiController/infoStudentController');


router.get('/expense', expenseController.quan_ly_dien_nuoc);

router.post('/expense/get_expense_table', expenseController.select_expense_table);

router.get('/expense/get_expense_data', expenseController.get_data);

router.get('/expense/refresh', expenseController.refresh_data);

router.post('/infoStudent/get', infoStudent.getListStudent);

module.exports = router;