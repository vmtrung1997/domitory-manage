var router = require('express').Router();
var expenseController = require('./../apiController/expenseController')
var activityController = require('./../apiController/activityController')
var newsController = require('./../apiController/newsController');
var infoStudent = require('../apiController/infoStudentController');
let repo = require('../repos/phongRepo');

// Expense
router.get('/expense', expenseController.quan_ly_dien_nuoc);

router.post('/expense/get_expense_table', expenseController.select_expense_table);

router.get('/expense/get_expense_data', expenseController.get_data);

router.post('/expense/add_expense', expenseController.add_data)

router.get('/expense/refresh', expenseController.refresh_data);

router.post('/expense/remove_expense', expenseController.remove_expense);

router.post('/expense/update_expense', expenseController.update_expense);

router.post('/expense/report', expenseController.report_expense);

router.get('/expense/get_parameter', expenseController.get_parameter);

router.post('/expense/config', expenseController.apply_config)

router.post('/expense/find',expenseController.find_expense);

router.post('/expense/check', expenseController.check_expense)

router.post('/expense/confirm_expense', expenseController.confirm)

// Activity
router.post('/activity/get_activity', activityController.get_list_activity);

router.get('/activity/detail', activityController.detail_activity);

router.post('/activity/post', activityController.post_activity);

router.post('/activity/delete', activityController.delete_activity);

router.post('/activity/update', activityController.update_activity);

router.post('/activity/rollcall', activityController.rollcall_activity)

// Info of student
router.post('/infoStudent/get', infoStudent.getListStudent);

router.post('/infoStudent/add', infoStudent.addStudent);

router.post('/infoStudent/delete', infoStudent.deleteStudent);

router.post('/infoStudent/update', infoStudent.updateInfo);

router.get('/getElement/:name', repo.get_element);


//News
router.post('/news/add',newsController.addNews);
router.get('/news/get',newsController.getNews);
router.post('/news/update',newsController.updateNews);
router.post('/news/delete',newsController.deleteNews);

module.exports = router;