const ObjectId = require('mongoose').mongo.ObjectId;
const md5 = require('md5');


const User = require('../models/TaiKhoan');
const ReToken = require('../models/refreshToken');
var auth = require('../repos/authRepo');

exports.register = (req, res) => {
	var userObject = req.body;
	userObject.password = md5(userObject.password);
	var user = new User(userObject);
	user.save().then(() => {
    console.log(req.body);
		res.status(201).json(req.body);
	}).catch(err => {
		console.log(err);
		res.status(500);
	})
}

exports.login = (req, res) => {
	User.findOne({ username: req.body.username, password: req.body.password }, function (error, result) {
		if (result) {
			var userEntity = result;
			var acToken = auth.generateAccessToken(userEntity);
			var reToken = auth.generateRefreshToken();
			auth.updateRefreshToken(result._id, reToken)
				.then(() => {
					console.log('==login sucess', req.body);
					res.status(200).json({
						status: 'success',
						access_token: acToken,
						refresh_token: reToken
					})
					console.log('==access token', acToken)
				}).catch(err => {
					res.status(500).json({
						status: 'fail 500',
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
};

exports.me_access = (req, res) => {
	var reToken = req.headers['x-refresh-token'];
	ReToken.findOne({ token: reToken }, null, function (err, result) {
		if (err) console.log(err);
		if (result) {
			var id = new ObjectId(result.userid);
			User.findOne({ '_id': id }, function (err, userEntity) {
				if (userEntity) {
					var acToken = auth.generateAccessToken(userEntity);
					res.status(200).json({
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
}