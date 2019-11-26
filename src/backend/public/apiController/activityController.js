const ObjectId = require('mongoose').Types.ObjectId;
const Activity = require('./../models/HoatDong');
const resultActivity = require('./../models/KetQuaHD');
const Profile = require('./../models/Profile');
const phong = require('./../models/Phong');
const writeXlsx = require('../repos/xlsxRepo')
const Account = require('./../models/TaiKhoan');


exports.get_list_activity = (req, res) => {
	const option = {
		options: {
			sort: { ngayBD: -1 }
		},
		page: req.query.page
	}

	var query = {}
	if(req.body.search){
		query = {
			$text: { $search: req.body.search }
		}
	}
	if(parseInt(req.body.month) !== 0){
		query.thang = parseInt(req.body.month)
	}
	if(parseInt(req.body.year) !== 0){
		query.nam = parseInt(req.body.year)
	}

	if(req.body.require === 'true' || req.body.require === 'false'){
		query.batBuoc = req.body.require === 'true' ? true : false
	}

	Activity.paginate( {} , { sort: {ngayBD : 1}})
	.then( last => {
		if(last.docs){
			Activity.paginate( query , option).then( result => {
				console.log('==get_activity: success')
				res.json({
					rs: result,
					last: last.docs[0]
				})
			})
		}
	}).catch(err => {
		console.log('==get_activity: ',err)
		res.status(500)
	})
};

exports.detail_activity = (req, res) => {
	const id = req.query.id
	resultActivity.find({ idHD: id })
	.populate('idSV')
	.then( data =>
		Activity.find({_id: id}).then( a =>
		res.json({rs: data, hd: a})
	))
};

exports.post_activity = (req, res) => {
	var tmp = {
		ten: req.body.name,
    	diaDiem: req.body.location,
    	ngayBD: new Date(req.body.date),
    	ngayKT: new Date(req.body.dateEnd),
    	thang: new Date(req.body.date).getMonth() + 1,
    	nam: new Date(req.body.date).getFullYear(),
    	batBuoc: req.body.isRequire,
    	soLuong: 0,
    	diem: req.body.point,
    	moTa: req.body.des
	}

	var act = new Activity(tmp)
	act.save().then(() => {
		console.log('==post_activity: success')
		res.json({rs: 'ok'})
	})
	.catch( err => {
		console.log('==post_activity: ',err)
		res.status(500)
	})

	// Nếu hoạt động bắt buộc thì tạo kết quả hoạt động cho sinh viên
	if(act.batBuoc){
		var query = {
			MSSV: {$ne: null},
			ngayVaoO: { $lte: act.ngayBD},
			ngayHetHan: {$gte: act.ngayBD}
		}
		Profile.find(query).then( result => {
			result.map( item => {
				var rs = new resultActivity({
					idHD: act._id,
					idSV: item._id,
					isTG: false,
					isDK: true
				})
				rs.save()
			})
		}).catch( err => {
			console.log('==post_activity_creatResultActivity: ',err)
			res.status(500)
		})
	}
};

exports.delete_activity = (req, res) => {
	const id = req.query.id
	Activity.deleteOne({ _id: id }, function (err) {
		if(!err){
			res.json({ rs: 'ok'})
			console.log('==delete_activity: success')
		}
		else{
			console.log('==delete_activity: ', err)
			res.status(500)
		}
	});
	resultActivity.deleteMany({ idHD: id }, err => {
		console.log('==delete_activity_deleteResultActivity: ',err)
		res.status(500)
	})
};

exports.update_activity = (req, res) => {
	const id = req.query.id

	var tmp = {
		ten: req.body.name,
    	diaDiem: req.body.location,
    	ngayBD: new Date(req.body.date),
    	ngayKT: new Date(req.body.dateEnd),
    	thang: new Date(req.body.date).getMonth() + 1,
    	nam: new Date(req.body.date).getFullYear(),
    	batBuoc: req.body.isRequire,
    	soLuong: 0,
    	diem: req.body.point,
    	moTa: req.body.des
	}

	if(tmp.batBuoc){

		var query = {
			MSSV: {$ne: null},
			ngayVaoO: { $lte: tmp.ngayBD},
			ngayHetHan: {$gte: tmp.ngayBD}
		}
		Profile.find(query).then( result => {
			result.map( item => {
				resultActivity.find({ idHD: id, idSV: item._id}).then( rs => {
					if(rs.length === 0){
						var tmpAC = new resultActivity({
							idHD: id,
							idSV: item._id,
							isTG: false,
							isDK: true
						})
						tmpAC.save()
					}
				})
			})
		}).catch( err => {
			console.log('==update_activity_creatResultActivity: ',err)
			res.status(500)
		})
	} else {
		Activity.findOne({ _id: id, batBuoc: true}, (err, val) => {
			if(err) { console.log('==update_activity: ', err )}
			if(val){
				resultActivity.deleteMany({ idHD: id, isTG: false, isDK: true}, err => {
					console.log('==update_activity_creatResultActivity: ',err)
					res.status(500)
				})
			}
		})
	}

	Activity.updateOne({ _id: id }, tmp, (err, val) => {
		if(!err){
			res.json({ rs: 'ok'})
			console.log('==update_activity: success')
		}
		else{
			console.log('==update_activity:', err)
			res.status(500)
		}
	})
};

exports.rollcall_activity = async (req, res) => {
	var data = {
		hd: req.body.idHD,
		the: req.body.idThe,
		sv: ''
	}
	var SV = await Profile.findOne({ maThe: data.the}, {'_id': 1, 'hoTen': 1, 'MSSV': 1}).catch(err => {
		console.log('==rollcall_activ:', err)
		res.status(500)
		return true
	})
	if(!SV){
		var tmp = await Profile.findOne({ MSSV: data.the}, {'_id': 1, 'hoTen': 1, 'MSSV': 1}).catch(err => {
			console.log('==rollcall_activ:', err)
			res.status(500)
			return true
		})
		if(tmp)
			data.sv = tmp
		else{
			res.status(200).json({rs: 'not found student'})
			return true
		}
	} else {
		data.sv = SV
	}

	if(data.sv){
		Account.findOne({idProfile: data.sv._id}, {isDelete: 0}, (err, acc) => {
			if(err) { console.log("==background: ", err )}
			if(acc) {
				resultActivity.findOne({ idHD: data.hd, idSV: data.sv._id }, (err,val) => {
					if(err){
						console.log('==rollcall_activity:', err)
						res.status(500)
						return true
					}
					if(!val) {
						var rs = new resultActivity({
							idHD: data.hd,
							idSV: data.sv._id,
							isTG: true
						})
						rs.save()
					} else {
						val.isTG = true
						val.save()
					}
					res.status(200).json({ rs: 'ok', data: data.sv})
					console.log('==rollcall_activity: success')
				})
			} else {
				res.status(200).json({ rs: 'delete'})
			}
		})
	}
};

exports.import_rollcall = async (req, res) => {
	const idHD = req.body.idHD
	const arrData = req.body.data

	arrData.map(async item => {
		var tmp = await Profile.findOne({ MSSV: item.mssv}, {'_id': 1}).catch(err => {
			console.log('==rollcall_activ:', err)
			res.status(500)
			return true
		})

		if(tmp){
			Account.findOne({idProfile: tmp._id}, {isDelete: 0}, (err, acc) => {
				if(err) { console.log("==background: ", err )}
				if(acc) {
					resultActivity.findOne({ idHD: idHD, idSV: tmp._id }, (err,val) => {
						if(err){
							console.log('==rollcall_activity:', err)
							res.status(500)
							return true
						}
						if(!val) {
							var rs = new resultActivity({
								idHD: idHD,
								idSV: tmp._id,
								isTG: true
							})
							rs.save()
						} else {
							val.isTG = true
							val.save()
						}
						console.log('==rollcall_activity: success')
					})
				}
			})
		}
	})

	res.status(200).json({ rs: 'ok' })
}

exports.export_activity = async (req, res) => {
	if(req.body.dateBegin && req.body.dateEnd){
		var begin = new Date(req.body.dateBegin)
		var end = new Date(req.body.dateEnd)
		var query = {
			MSSV: {$ne: null},
			ngayVaoO: { $lte: end},
			ngayHetHan: {
				$gte: begin,
				$ne: null
			}
		}
		var promiseStu = Profile.find(query).populate('idPhong')
		var promiseAc = Activity.find({
			ngayBD: {
				$gte: begin,
				$lte: end
			}
		})

		const [student, activity] = await Promise.all([promiseStu, promiseAc])

		var header = ['', '',`Điểm phong trào ktx Trần Hưng Đạo từ ${begin.toLocaleDateString('de-DE')} đến ${end.toLocaleDateString('de-DE')}`]

		var sheet = [header]
		sheet.push([
			'MSSV', 'HỌ VÀ TÊN', 'PHÒNG', 'TỔNG ĐIỂM',
			...
			activity.map((item, key) => {
				return item.ten
			})
		])
		await Promise.all(
			student.map( async (stu, i) => {
				var sumPoint = 0
				var arrPromisePoint = activity.map( async (ac, j) => {
					var rs = await resultActivity
						.findOne({ idHD: ac._id, idSV: stu._id})
						.populate('idHD')
						.catch( err => {
							console.log('==export_activity:', err)
							res.status(500)
						})

					if(rs){
						if(isNaN(rs.idHD.diem)){
							return 0
						}
						if(stu.ngayVaoO > rs.idHD.ngayBD){
							return 0
						} else {
							if(rs.isTG){
								sumPoint += rs.idHD.diem
								return rs.idHD.diem
							}
							if(rs.idHD.batBuoc && !rs.isTG){
								sumPoint += -rs.idHD.diem
								return -rs.idHD.diem
							}
						}
					} else {
						if(ac.batBuoc){
							sumPoint += -ac.diem
							return -ac.diem
						} else {
							return 0
						}
					}

				})

				var phong = ''
				if(stu.idPhong)
					phong = stu.idPhong.tenPhong
				const arrPoint = await Promise.all(arrPromisePoint)

				sheet.push([stu.MSSV, stu.hoTen,  phong , sumPoint , ... arrPoint])
			})
		)

		var opts = { row: 1 + activity.length, col: 2 + student.length}
		var xlsx = writeXlsx.save(sheet, opts);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.status(200).json({ filename: 'Bao-cao-hoat-dong.xlsx', file: xlsx });
	} else {
		res.status(404).json({ err: 'Not found'});
	}
};

exports.export_detail_activity = async (req,res) => {
	if(req.body.data){
		const activity = req.body.data
		var header = []
		var date = new Date(activity.ngayBD)
		var strDate = date.toLocaleDateString('en-GB')

		var sheet = [['',`Báo cáo của hoạt động ${activity.ten}`],
					 ['', 'Địa điểm', activity.diaDiem],
					 ['', 'Ngày diển ra', strDate],
					 ['', 'Điểm', activity.diem],
					 [''],
					 ['STT', 'MSSV', 'HỌ VÀ TÊN', 'PHÒNG', 'ĐĂNG KÝ', 'THAM GIA']]

		await resultActivity.find({idHD: activity._id})
				.populate({
					path : 'idSV',
				    populate : {
				     	path : 'idPhong'
				    }
				})
				.then( result => {
					var i = 1
					var sumDK = 0
					var sumTG = 0
					result.map( item => {
						item.isTG ? sumTG++ : sumTG
						item.isDK ? sumDK++ : sumDK
						var p = item.idSV.idPhong ? item.idSV.idPhong.tenPhong : ''
						sheet.push([i++, item.idSV.MSSV || '', item.idSV.hoTen || '', p, item.isDK ? 'X' : '', item.isTG ? 'X' : '' ])
					})

					sheet.push([,,,'Tổng', sumDK, sumTG])
				})

		var opts = { row: 6, col: sheet.length}
		var xlsx = writeXlsx.save(sheet, opts);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.status(200).json({ filename: 'Bao-cao-hoat-dong.xlsx', file: xlsx });
	} else {
		res.status(404).json({ err: 'Not found'});
	}
};
