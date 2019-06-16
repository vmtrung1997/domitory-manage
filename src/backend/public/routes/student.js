var router = require('express').Router();
var studentController = require('../apiController/studentController')

router.post('/get-info', studentController.getInfo);

router.post('/get-info-by-idCard', studentController.getInfoByIdCard);

router.post('/get-specialized', studentController.getSpecialized);

router.get('/get-school',studentController.getSchool);

router.post('/get-bill',studentController.getBill);

router.post('/get-last-bill',studentController.getLastBill);

router.post('/get-list-activities',studentController.getListActivities);

router.post('/register-activities',studentController.registerActivities);

router.post('/cancel-register-activities',studentController.cancelRegisterActivities);

router.post('/my-upcoming-activities',studentController.upcomingActivities);

router.post('/update-first-info',studentController.updateFisrtInfo);

router.post('/change-password', studentController.changePassword);

router.post('/get-room',studentController.getRoom);

router.post('/update-room',studentController.updateRoom);

router.post('/get-profile-by-idPhong',studentController.getProfileByIdPhong);

router.post('/get-point',studentController.getPoint);

router.post('/request-stay',studentController.requestStay);

router.post('/check-request',studentController.checkRequest);

router.get('/get-floor',studentController.getListFloor);

module.exports = router;