var router = require('express').Router();

var taiKhoan = require('../apiController/userController')

router.post('/login', taiKhoan.login);

router.post('/register', taiKhoan.register);

router.get('/me_access', taiKhoan.me_access);

router.get('/test_sv', require('../repos/testDb').update_image)

module.exports = router;