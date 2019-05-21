const ObjectId = require('mongoose').Types.ObjectId;
const Activity = require('./../models/HoatDong');
const resultActivity = require('./../models/KetQuaHD');
const Profile = require('./../models/Profile');
const phong = require('./../models/Phong');
const writeXlsx = require('../repos/xlsxRepo')

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
	console.log(req.body)
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
	console.log(tmp)

	var timeFirst = req.body.time.split(':')
	var timeFinal = req.body.timeEnd.split(':')

	tmp.ngayBD.setHours(parseInt(timeFirst[0]),parseInt(timeFirst[1]))
	tmp.ngayKT.setHours(parseInt(timeFinal[0]),parseInt(timeFinal[1]))
	
	var act = new Activity(tmp)
	act.save().then(() => {
		console.log('==post_activity: success')
		res.json({rs: 'ok'})
	})
	.catch( err => {
		console.log('==post_activity: ',err)
		res.status(500)
	})
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
};

exports.update_activity = (req, res) => {
	const id = req.query.id
	var data = {
		ten: req.body.name,
    	diaDiem: req.body.location,
    	ngayBD: req.body.date,
    	ngayKT: req.body.dateEnd,
    	thang: new Date(req.body.date).getMonth() + 1,
    	nam: new Date(req.body.date).getFullYear(),
    	batBuoc: req.body.isRequire,
    	diem: req.body.point,
    	moTa: req.body.des
	}

	var timeFirst = req.body.time.split(':')
	var timeFinal = req.body.timeEnd.split(':')

	var dateFirst = new Date(data.ngayBD)
	var dateFinal = new Date(data.ngayKT)

	dateFirst.setHours(parseInt(timeFirst[0]),parseInt(timeFirst[1]))
	dateFinal.setHours(parseInt(timeFinal[0]),parseInt(timeFinal[1]))

	data.ngayBD = dateFirst
	data.ngayKT = dateFinal

	Activity.updateOne({ _id: id }, data, (err, val) => {
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
	var SV = await Profile.findOne({ maThe: data.the}, '_id').catch(err => {
		console.log('==rollcall_activ:', err)
		res.status(500)
		return true
	})
	if(!SV){
		res.status(200).json({rs: 'not found student'})
		return true
	} else {
		data.sv = SV._id
	}
	
	if(data.sv){
		resultActivity.findOne({ idHD: data.hd, idSV: data.sv }, (err,val) => {
			if(err){
				console.log('==rollcall_activity:', err)
				res.status(500)
				return true
			}
			if(!val) {
				var rs = new resultActivity({
					idHD: data.hd,
					idSV: data.sv,
					isTG: true
				})
				rs.save()
			} else {
				val.isTG = true
				val.save()
			}
			res.status(200).json({ rs: 'ok'})
			console.log('==rollcall_activity: success')
		})
	}
};

exports.export_activity = async (req, res) => {
	if(req.body.year){
		const year = req.body.year
		var query = {
			MSSV: {$ne: null},
			ngayVaoO: { $lte: new Date(year, 7, 31)},
			ngayHetHan: {$gte: new Date(year-1, 8, 1)}
		}
		var promiseStu = Profile.find(query).populate('idPhong')
		var promiseAc = Activity.find({
				ngayBD: {
					$gte: new Date(year-1, 8, 1),
					$lte: new Date(year, 7, 31)
				}
			})
		
		const [student, activity] = await Promise.all([promiseStu, promiseAc])

		var header = ['', '',`Điểm phong trào ktx Trần Hưng Đạo năm học ${year-1} - ${year}`]

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
						if(rs.isTG){
							sumPoint += rs.idHD.diem
							return rs.idHD.diem
						}
						if(rs.idHD.batBuoc && !rs.isTG){
							sumPoint += -rs.idHD.diem
							return -rs.idHD.diem
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
	}
	
};
