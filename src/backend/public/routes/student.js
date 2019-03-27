var router = require('express').Router();
var studentController = require('../apiController/studentController')

router.post('/get-info', studentController.getInfo);

router.post('/get-info-by-idCard', studentController.getInfoByIdCard);

router.get('/get-specialized', studentController.getSpecialized);

router.get('/get-school',studentController.getSchool);

router.post('/get-bill',studentController.getBill);

router.post('/get-list-activities',studentController.getListActivities);

router.post('/register-activities',studentController.registerActivities);

router.post('/cancel-register-activities',studentController.cancelRegisterActivities);

router.post('/my-upcoming-activities',studentController.upcomingActivities);

router.post('/update-info',studentController.updateInfo);

router.get('/', studentController.a)
module.exports = router;