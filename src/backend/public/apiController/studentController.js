const ObjectId = require('mongoose').mongo.ObjectId;
const md5 = require('md5');
const Student = require('../models/SinhVien')

const User = require('../models/TaiKhoan');
const ReToken = require('../models/refreshToken');
var auth = require('../repos/authRepo');

exports.a = (req, res) => {
	res.status(200).json({
		status: 'success',
	})
}


exports.getInfo = (req, res) => {
	var id = req.body.id;
	console.log(req.body.username);
	Student.findOne({idTaiKhoan: id}, function(err, result){
			if(result){
				console.log(result);
			}
			else{
				console.log('Khong co du lieu');
			}
	});
	res.status(200).json({
		status: 'success',

	})
}
  //   User.findOne({ username: req.body.username, password: req.body.password }, function (error, result) {
	// 	if (result) {
	// 		var userEntity = result;
	// 		var acToken = auth.generateAccessToken(userEntity);
	// 		var reToken = auth.generateRefreshToken();
	// 		auth.updateRefreshToken(result._id, reToken)
	// 			.then(() => {
	// 				res.status(200).json({
	// 					status: 'success',
	// 					access_token: acToken,
  //                       refresh_token: reToken,
  //                       result:  userEntity
	// 				})
	// 			}).catch(err => {
	// 				res.status(500).json({
	// 					status: 'fail',
	// 					msg: err
	// 				})
	// 			})
	// 	} else {
	// 		res.status(401).json({
	// 			status: 'fail',
	// 			auth: false
	// 		})
	// 	}
	// })