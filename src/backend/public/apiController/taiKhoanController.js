const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').mongo.ObjectId;
const md5 = require('md5');


const User = require('../models/TaiKhoan');
const ReToken = require('../models/refreshToken');
var auth = require('../repos/authRepo');

router.post('/register', (req, res) => {
	var userObject = req.body;
	userObject.password = md5(userObject.password);
	var user = new User(userObject);
	user.save().then(() => {
		res.status(201).json(req.body);
	}).catch(err => {
		console.log(err);
		res.status(500);
	})
})

router.post('/login', (req, res) => {
	User.findOne({ username: req.body.username, password: md5(req.body.password) }, function (error, result) {
		if (result) {
			var userEntity = result;
			var acToken = auth.generateAccessToken(userEntity);
			var reToken = auth.generateRefreshToken();
			auth.updateRefreshToken(result._id, reToken)
				.then(() => {
					res.status(201).json({
						status: 'success',
						user: userEntity,
						access_token: acToken,
						refresh_token: reToken
					})
				}).catch(err => {
					res.status(500).json({
						status: 'fail',
						msg: err
					})
				})
		} else {
			res.status(401).json({
				status: 'fail',
				auth: false
			})
		}
	})
});

router.post('/me_access', (req, res) => {
	var reToken = req.body.refresh_token;
	ReToken.findOne({ token: reToken }, null, function (err, result) {
		if (err) console.log(err);
		if (result) {
			var id = new ObjectId(result.userid);
			User.findOne({ '_id': id }, function (err, userEntity) {
				if (userEntity) {
					var acToken = auth.generateAccessToken(userEntity);
					res.status(201).json({
						auth: true,
						user: userEntity,
						access_token: acToken,
						refresh_token: reToken
					})
				}
			})
		} else {
			res.status(401).end('end')
		}
	})
})

router.get('/deleteRefreshToken', (req, res) => {
	var reToken = req.body.refresh_token;
	ReToken.findOneAndDelete({ token: reToken }, null, function (err, result) {
		if (result) {
			res.status(201);
		} else {
			console.log(err);
			res.statusC(500);
		}
	})
})

module.exports = router;