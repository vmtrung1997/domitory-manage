const Profile = require('../models/Profile');
const NganhHoc = require('../models/NganhHoc');
const Truong = require('../models/Truong');
const ChiPhiPhong = require('../models/ChiPhiPhong');
const HoatDong = require('../models/HoatDong');
const KetQuaHD = require('../models/KetQuaHD');
require('../models/Phong')
require('../models/NganhHoc')
require('../models/Truong')
require('../models/HoatDong');

const moment = require('moment');
const today = moment().startOf('day');


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

exports.getListActivities = (req, res) => {
	var date = new Date();

	KetQuaHD.find({ idSV: req.body.id }).select('idHD').then(result => {
		var arr = [];
		result.forEach(item => {
			arr.push(item.idHD);
		})
		HoatDong.find({ _id: { $nin: arr }, ngay: { $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()) } }).sort({ nam: 1, thang: 1 }).then(rs => {
			if (!rs) {
				res.status(400).json({
					status: 'fail',
					data: 'no data'
				})
			}
			else {
				res.status(200).json({
					status: 'success',
					data: rs
				})
			}
		})
	})

}

exports.cancelRegisterActivities = (req,res) =>{
	req.body.data.activity.forEach(item => {
		try {
			KetQuaHD.deleteOne({idHD: item.idHD, idSV: req.body.data.user}).then(() => {
				console.log('==delete: success')
				res.status(201).json({
					message: 'ok'
				})
			}).catch(err => {
				console.log('==insert: ', err);
				res.status(500);
			})
		} catch (e) {
			console.log(e);
		}
	})

}

exports.registerActivities = (req, res) => {
	req.body.data.activity.forEach(item => {
		try {
			var data = {
				idHD: item,
				idSV: req.body.data.user,
				status: '0'
			}
			var register = new KetQuaHD(data);
			register.save().then(() => {
				console.log('==insert: success')
				res.status(201).json({
					message: 'ok'
				})
			}).catch(err => {
				console.log('==insert: ', err);
				res.status(500);
			})
		} catch (e) {
			console.log(e);
		}
	})
}


exports.updateInfo = (req, res) => {

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
			} else {
				res.status(201).json({
					res: 'success',
					data: place,
				})
			}
		});

}

exports.getBill = (req, res) => {
	//console.log(req.body.id);
	ChiPhiPhong.find({ idPhong: req.body.id }).sort({ nam: -1, thang: -1 }).then(result => {
		if (result) {

			res.status(200).json({
				status: 'success',
				data: result
			})
		}
		else {
			res.status(400).json({
				status: 'fail',
				data: 'no data'
			})
		}
	})
}

exports.getSchool = (req, res) => {
	Truong.find().then(result => {
		res.status(200).json({
			status: 'success',
			data: result
		})
	})
}

exports.upcomingActivities = (req,res) => {
	KetQuaHD.find({idSV: req.body.id}).populate({path: 'idHD'}).then(result=>{
		if (result) {

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
}

exports.getInfo = (req, res) => {
	var id = req.body.id;
	
	Profile.findOne({ idTaiKhoan: id }).populate([{ path: 'truong', select: 'tenTruong' }, { path: 'nganhHoc', select: 'tenNganh' }, { path: 'idPhong', select: 'tenPhong lau' }])
		.then(result => {
			
			if (result) {

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

exports.getInfoByIdCard = (req, res) => {
	var idCard = req.body.idCard;
	
	Profile.findOne({ maThe: idCard }).then(result => {	
		if (result) {
			res.status(200).json({
				status: 'success',
				student: result
			})
		} else {
			res.json({
				status: 'fail',
				data: 'no data'
			})
		}
	}).catch(err => {
		console.log(err);
	});
}
