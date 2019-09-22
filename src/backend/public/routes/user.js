var router = require('express').Router()

var taiKhoan = require('../apiController/userController')

router.post('/login', taiKhoan.login)

router.post('/register', taiKhoan.register)

router.get('/me_access', taiKhoan.me_access)

router.post('/reset-password',taiKhoan.resetPassword)

router.post('/reset-password-admin', taiKhoan.resetPasswordAdmin)

router.post('/change-password-admin', taiKhoan.changePasswordAdmin)

router.get('/import_detail_room',require('../repos/testDb').import_detail_room)

module.exports = router;