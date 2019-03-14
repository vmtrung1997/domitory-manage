const ObjectId = require('mongoose').mongo.ObjectId;
const md5 = require('md5');
const Profile = require('../models/Profile');
const NganhHoc = require('../models/NganhHoc');
const Truong = require('../models/Truong');
require('../models/Phong')
require('../models/NganhHoc')
require('../models/Truong')


exports.a = (req, res) => {
	res.status(200).json({
		status: 'success',
	})
}

exports.getSpecialized = (req, res) => {
	NganhHoc.find().then(result => {
		res.status(200).json({
			status: 'success',
			data: result
		})
	})
}

exports.updateInfo = (req, res) => {

	console.log(req.body);
	Profile.findOneAndUpdate({ idTaiKhoan: req.body.data.idTaiKhoan },
		{
			MSSV: req.body.data.MSSV,
			danToc: req.body.data.danToc,
			diaChi: req.body.data.diaChi,
			email: req.body.data.email,
			gioiTinh: req.body.data.gioiTinh,
			hoTen: req.body.data.hoTen,
			idPhong: req.body.data.idPhong,
			nganhHoc: req.body.data.nganhHoc,
			ngayHetHan: req.body.data.ngayHetHan,
			ngaySinh: req.body.data.ngaySinh,
			ngayVaoO: req.body.data.ngayVaoO,
			sdt: req.body.data.sdt,
			sdtNguoiThan: req.body.data.sdtNguoiThan,
			truong: req.body.data.truong
		},
		function (err, place) {
			if (err) {
				res.status(400).json({
					err: err
				})
			}else{
				res.status(201).json({
					res: 'success',
					data: place,
				})
			}
		});

}

exports.getSchool = (req, res) => {
	Truong.find().then(result => {
		res.status(200).json({
			status: 'success',
			data: result
		})
	})
}

exports.getInfo = (req, res) => {
	var id = req.body.id;
	console.log(id);
	Profile.findOne({ idTaiKhoan: id }).populate([{ path: 'truong', select: 'tenTruong' }, { path: 'nganhHoc', select: 'tenNganh' }, { path: 'idPhong', select: 'tenPhong lau' }])
		.then(result => {
			if (result) {
				console.log(result);
				res.status(200).json({
					status: 'success',
					data: result
				})
			}
			else {
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
