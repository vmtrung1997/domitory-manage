var router = require('express').Router();

var expenseController = require('./../apiController/expenseController')
var activityController = require('./../apiController/activityController')
var newsController = require('./../apiController/newsController');
var infoStudent = require('./../apiController/infoStudentController');
var infoDormitory = require('./../apiController/infoDormitoryController');
var accountController = require('./../apiController/accountController');
var historyController = require('../apiController/historyController');
let repo = require('../repos/phongRepo');
var universityController = require('../apiController/universityController');
var registeredController = require('./../apiController/registeredController');
var databaseLogController = require('./../apiController/databaseLogController')
// Expense
router.get('/expense', expenseController.quan_ly_dien_nuoc);

router.post('/expense/get_expense_table', expenseController.select_expense_table);

router.post('/expense/get_room_option', expenseController.get_room_option);

router.post('/expense/add_expense', expenseController.add_data)

router.get('/expense/refresh', expenseController.refresh_data);

router.post('/expense/remove_expense', expenseController.remove_expense);

router.post('/expense/update_expense', expenseController.update_expense);

router.post('/expense/report', expenseController.report_expense);

router.get('/expense/get_parameter', expenseController.get_parameter);

router.get('/expense/get_year', expenseController.get_year);

router.post('/expense/config', expenseController.apply_config)

router.post('/expense/find',expenseController.find_expense);

router.post('/expense/check', expenseController.check_expense);

router.post('/expense/confirm_expense', expenseController.confirm);

router.get('/expense/get_room_type',expenseController.get_type_room);

router.post('/expense/detail_room', expenseController.get_detail_type_room);

router.post('/expense/update_room_type', expenseController.update_detail_type_room);

router.post('/expense/info_room', expenseController.get_info_room);

router.post('/expense/reset_room', expenseController.reset_room);

router.post('/expense/get_data_print', expenseController.get_data_print);

router.post('/expense/get_person_in_room', expenseController.get_person_room);

// Activity
router.post('/activity/get_activity', activityController.get_list_activity);

router.post('/activity/export_activity', activityController.export_activity);

router.post('/activity/export_detail_activity', activityController.export_detail_activity);

router.get('/activity/detail', activityController.detail_activity);

router.post('/activity/post', activityController.post_activity);

router.post('/activity/delete', activityController.delete_activity);

router.post('/activity/update', activityController.update_activity);

router.post('/activity/rollcall', activityController.rollcall_activity);

router.post('/activity/import_rollcall', activityController.import_rollcall);

// Info of student
router.post('/infoStudent/getPaging', infoStudent.getListStudentPaging);

router.post('/infoStudent/getAll', infoStudent.getListStudent);

router.post('/infoStudent/add', infoStudent.addStudent);

router.post('/infoStudent/convertStudent', infoStudent.convertStudent);

router.post('/infoStudent/update', infoStudent.updateInfo);

router.post('/infoStudent/importFile', infoStudent.importFile);

router.get('/infoStudent/getActivities/:mssv', infoStudent.getListActivitiesByMSSV);

router.get('/infoStudent/getDetail/:mssv', infoStudent.getProfile);

router.get('/getElement/:name', repo.get_element);

router.get('/getRoomHistory/:id', infoStudent.getRoomHistory);

//Info dormitory
router.get('/infoDormitory/getRoom/:floor', infoDormitory.getRoom);

router.post('/infoDormitory/addRoom', infoDormitory.addRoom);

router.post('/infoDormitory/updateRoom', infoDormitory.updateRoom);

router.get('/infoDormitory/delRoom/:id', infoDormitory.delRoom);

router.get('/infoDormitory/getRoomType', infoDormitory.getRoomType);

router.post('/infoDormitory/addRoomType', infoDormitory.addRoomType);

router.post('/infoDormitory/updateRoomType', infoDormitory.updateRoomType);

router.post('/infoDormitory/removeRoomType', infoDormitory.removeRoomType);

router.get('/infoDormitory/getPersonInRoom/:idPhong', infoDormitory.getPersonInRoom);

router.get('/getRoomWithFloor', infoDormitory.getFloorRoom);

//News
router.post('/news/add',newsController.addNews);

router.post('/news/get',newsController.getNews);

router.post('/news/update',newsController.updateNews);

router.post('/news/delete',newsController.deleteNews);

//Accounts
router.post('/account/get_list_account',accountController.get_List);

router.get('/account/get_detail',accountController.get_Detail);

router.post('/account/add_account',accountController.add_Account);

router.post('/account/update_account',accountController.update_Account);

router.post('/account/delete_account',accountController.delete_Account);

//Security
router.post('/security/history', historyController.find_history);

//University
router.get('/university/getSchools', universityController.getSchoolList);

router.post('/university/insertSchool',universityController.insertSchool);

router.post('/university/updateSchool',universityController.editSchool);

router.post('/university/removeSchool',universityController.removeSchool);

router.post('/university/getMajor', universityController.getMajor);

router.post('/university/insertMajor',universityController.insertMajor);

router.post('/university/updateMajor',universityController.updateMajor);

router.post('/university/removeMajor',universityController.removeMajor);

//Registed
router.post('/register/getListRegister', registeredController.get_list_register);

router.post('/register/acceptRequest', registeredController.accept_request);

//Database log
router.post('/logDb/get_log', databaseLogController.getLog);

module.exports = router;