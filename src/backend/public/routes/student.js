var router = require('express').Router();
var studentController = require('../apiController/studentController')

router.post('/get-info', studentController.getInfo);

router.get('/get-specialized', studentController.getSpecialized);

router.get('/get-school',studentController.getSchool);

router.post('/update-info',studentController.updateInfo);

router.get('/', studentController.a)
module.exports = router;