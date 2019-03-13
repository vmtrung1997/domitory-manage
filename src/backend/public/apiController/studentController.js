const ObjectId = require('mongoose').mongo.ObjectId;
const md5 = require('md5');
const Profile = require('../models/Profile');
const NganhHoc = require('../models/NganhHoc');
require('../models/Phong')
require('../models/NganhHoc')
require('../models/Truong')


exports.a = (req, res) => {
	res.status(200).json({
		status: 'success',
	})
}

exports.getSpecialized = (req,res) => {
	NganhHoc.find().then(result =>{
		res.status(200).json({
			status: 'success',
			data: result
		})
	})
}


exports.getInfo = (req, res) => {
	var id = req.body.id;
	console.log(id);
	Profile.findOne({idTaiKhoan: id}).populate([{path: 'truong', select: 'tenTruong'}, {path: 'nganhHoc', select: 'tenNganh'}, {path: 'idPhong', select: 'tenPhong lau'}])
	.then(result => {
			if(result){
				console.log(result);
				res.status(200).json({
					status: 'success',
					data: result
				})
			}
			else{
				res.json({
					status: 'fail',
					data: 'no data'
				})
			}
	})
	.catch(err => {
		console.log(err);
	});
	
}
