const ObjectId = require('mongoose').Types.ObjectId;
const ChiPhiPhong = require('../models/ChiPhiPhong')
const ChiPhiHienTai = require('../models/ChiSoHienTai')
const phongRepo = require('../repos/phongRepo')
const writeXlsx = require('../repos/xlsxRepo')
const ThongSo = require('../models/ThongSo')

exports.quan_ly_dien_nuoc = (req, res, next) => {
	res.json({
		msg: 'from quan ly dien nuoc'
	})
};
exports.get_data = (req, res) => {
	phongRepo.get_room().then(result => {
		res.json({
			status: 'success',
			result: result
		})
	})
}
exports.select_expense_table = (req, res) => {
	var search = req.body;
	var options = req.body.options;
	// console.log(search);
	options.populate = { path: 'idPhong', select: 'tenPhong', options: { sort: 'tenPhong' } }
	options.sort = '-nam -thang idPhong'
	var searchObj = {};
	if (search.month !== 0) {
		searchObj.thang = search.month;
	}
	if (search.year !== 0) {
		searchObj.nam = search.year
	}
	if (search.status !== 2)
		searchObj.trangThai = search.status

	if (search.room !== 0 && search.room.value !== 0)
		searchObj.idPhong = search.room.value
	// console.log('==searchObj: ', searchObj);
	// console.log('==options: ', options)
	ChiPhiPhong.paginate(searchObj, options).then(value => {
		// console.log(value);
		res.json({
			rs: value
		})
	}).catch(err => { console.log(err) })
};

function update_data(item, cb) {
	var id = new ObjectId(item._id);
	var idPhong = new ObjectId(item.idPhong);
	setTimeout(() => {
		ChiPhiPhong.updateOne({ _id: id }, {
			$set: {
				'idPhong': idPhong
			}
		}, (_, err) => {
			cb()
		})
	}, 100)
}
function CalculateTien(arr, number) {
	let total = 0;
	let temp = number
	for (let i = 0; i < arr.length; i++) {
		if (temp >= arr[i].giaTriDau && temp <= arr[i].giaTriCuoi) {
			for (let j = 0; j < i; j++) {
				if (j != 0)
					total = total + (arr[j].giaTriCuoi - arr[j].giaTriDau + 1) * arr[j].giaTriThuc;
				else
					total = total + (arr[j].giaTriCuoi - arr[j].giaTriDau) * arr[j].giaTriThuc;
			}
			total = total + (number - arr[i].giaTriDau +1) * arr[i].giaTriThuc;
			break;
		}
	}
	return total;
}
exports.find_expense = (req, res) => {
	var exp = req.body;
	ChiPhiPhong
		.findOne({ thang: exp.thang, nam: exp.nam, idPhong: exp.phong.value })
		.then(value => {
			if (value) {
				res.json({
					rs: 'fail'
				})
			} else {
				res.json({
					rs: 'accept'
				})
			}
		})
}
exports.check_expense = (req, res) => {
	var exp = req.body;
	ChiPhiHienTai
	.findOne({idPhong: exp.phong.value, $or: [{soDien: {$gt: exp.soDien}}, {soNuoc: {$gt:exp.soNuoc}}]})
	.then(value => {
		if (value) {
			res.json({
				rs: 'fail'
			})
		} else {
			res.json({
				rs: 'accept'
			})
		}
	})
}
exports.add_data = (req, res) => {
	var table = req.body
	var tableAdd = [];
	ThongSo.find().sort({ id: 1 }).then(thongSoArr => {
		if (thongSoArr.length > 0) {
			var arrDien = thongSoArr.filter(value => value.loaiChiPhi === 'dien').sort((a,b)=> {return a.id - b.id})
			var arrNuoc = thongSoArr.filter(value => value.loaiChiPhi === 'nuoc').sort((a,b)=>{return a.id - b.id})
			ChiPhiHienTai.find().then(vals => {
				if (vals.length > 0) {
					table.forEach(row => {
						var obj = vals.find((val) => val.idPhong === row.phong.value)
						if (obj) {
							var tienDien = Math.round(CalculateTien(arrDien, row.soDien - obj.soDien) *1000)/1000
							var tienNuoc = CalculateTien(arrNuoc, row.soNuoc - obj.soNuoc)
							var tongTien = Math.round((tienDien + tienNuoc) * 1000) / 1000
							tableAdd.push({
								idPhong: row.phong.value,
								thang: row.thang,
								nam: row.nam,
								soDien: row.soDien,
								soNuoc: row.soNuoc,
								soDienCu: obj.soDien,
								soNuocCu: obj.soNuoc,
								tienDien: tienDien,
								tienNuoc: tienNuoc,
								tienRac: 30000,
								tongTien: tongTien,
								tongTienChu: '',
								trangThai: 0
							})
						}
					});
					if (tableAdd.length > 0) {
						ChiPhiPhong.insertMany(tableAdd).then((result) => {
							if (result.length > 0) {
								res.status(201).json({
									rs: 'success',
									data: result,
								})
							}
						}).catch(err => { res.json({ rs: 'fail', msg: err }) })
					} else {
						res.json({
							rs: 'fail',
						})
					}
				}
			})
		}
	})
};
exports.confirm = (req, res) => {
	var id = new ObjectId(req.body.id);
	ChiPhiPhong.findOneAndUpdate({_id: id},{
		$set: {
			'trangThai': 1
		}
	},(err, doc) => {
		if (err){
			res.json({
				rs: 'fail',
				msg: err
			})
		} else {
			ChiPhiHienTai.findOneAndUpdate({idPhong: doc.idPhong},{
				$set:{
					soDien: doc.soDien,
					soNuoc: doc.soNuoc
				}
			}, (err) => {
				if (err){
					res.json({
						rs: 'fail',
						msg: err
					})
				} else {
					res.json({
						rs: 'success',
						data: doc
					})
				}
			})
		}
	})
}
exports.remove_expense = (req, res) => {
	var exp = req.body;
	var id = new ObjectId(exp._id);
	ChiPhiPhong.deleteOne({ _id: id }, (err) => {
		if (err) {
			res.status(400).json({
				rs: 'fail',
				msg: err
			})
		} else {
			res.status(201).json({
				rs: 'success'
			})
		}
	})
}
exports.update_expense = (req, res) => {
	ThongSo.find().sort({ id: 1 }).then(thongSoArr => {
		if (thongSoArr.length > 0) {
			var exp = req.body;
			var id = new ObjectId(exp._id);
			var arrDien = thongSoArr.filter(value => value.loaiChiPhi === 'dien').sort((a,b)=> {return a.id - b.id})
			var arrNuoc = thongSoArr.filter(value => value.loaiChiPhi === 'nuoc').sort((a,b)=>{return a.id - b.id})
			var tienDien = Math.round(CalculateTien(arrDien, exp.soDien - exp.soDienCu) *1000)/1000
			var tienNuoc = CalculateTien(arrNuoc, exp.soNuoc - exp.soNuocCu)
			var tongTien = Math.round((tienDien + tienNuoc) * 1000) / 1000
			exp.tienDien = tienDien
			exp.tienNuoc = tienNuoc
			exp.tongTien = tongTien

			ChiPhiPhong.updateOne({ _id: id }, exp, (err) => {
				if (err) {
					res.status(400).json({
						rs: 'fail',
						msg: err
					})
				} else {
					res.status(201).json({
						rs: 'success'
					})
				}
			})
		}})
}
exports.reports_expense = (req, res) => {
	var xlsx = writeXlsx.testXlsx();
	res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
	res.json({ filename: 'Report.xlsx', file: xlsx });
}
exports.report_expense = (req, res) => {
	var condition = req.body;
	var query = {};
	var header = ['Năm', 'Tháng', 'Tên phòng']
	var options = ['nam', 'thang']
	if (condition.disableToMonth === true) {
		query.thang = condition.fromMonth;
		query.nam = condition.fromYear;
		if (condition.room !== 0) {
			query.idPhong = condition.room
		}
		if (condition.status !== 0) {
			query.trangThai = condition.status
		}
	}
	else {
		if (condition.fromYear === condition.toYear) {
			if (condition.fromMonth < condition.toMonth) {
				query.thang = { $gte: condition.fromMonth, $lte: condition.toMonth }
				query.nam = condition.fromYear
				if (condition.room !== 0) {
					query.idPhong = condition.room
				}
				if (condition.status !== 0) {
					query.trangThai = condition.status
				}
			}
			else {
				res.json({
					rs: false,
					msg: 'Dieu kien sai'
				})
			}
		} else if (condition.fromYear < condition.toYear) {
			var or = [
				{ thang: { $gte: condition.fromMonth, $lte: 12 }, nam: condition.fromYear },
				{ thang: { $gte: 1, $lte: condition.toMonth }, nam: condition.toYear }
			]
			if (condition.toYear - condition.fromYear > 1) {
				for (let i = condition.fromYear + 1; i < condition.toYear; i++) {
					or.push({ nam: i })
				}
			}
			query.$and = [{
				$or: or
			}]
			if (condition.room !== 0) {
				query.$and.push({ idPhong: condition.room })
			}
			if (condition.status !== 0) {
				query.$and.push({ trangThai: condition.status })
			}


		} else {
			res.json({
				rs: false,
				msg: 'Dieu kien sai'
			})
		}
	}
	if (condition.soDien) {
		options.push('soDien')
		options.push('soDienCu')
		header.push('Số điện trong tháng')
	}
	if (condition.soNuoc) {
		options.push('soNuoc')
		options.push('soNuocCu')

		header.push('Số nước trong tháng')
	}
	if (condition.tienRac) {
		options.push('tienRac')

		header.push('Tiền rác')
	}
	if (condition.tongTien) {
		options.push('tienDien')
		options.push('tienNuoc')
		options.push('tongTien')
		options.push('tongTienChu');

		header.push('Tiền điện');
		header.push('Tiền nước')
		header.push('Tổng tiền')
		header.push('Tổng tiền chữ')
	}
	//console.log('==query: ', query);
	//console.log('==options: ', options);
	ChiPhiPhong.find(query)
		.sort([['nam', 1], ['thang', 1]])
		.select(options)
		.populate({
			path: 'idPhong',
			select: 'tenPhong',
			options: { sort: { tenPhong: 1 } }
		})
		.then(result => {
			var array = []
			array.push(header);
			var total = ['', '', 'Tổng', 0, 0, 0, 0, '']
			for (let item of result) {
				var arr = []
				arr.push(item.nam);
				arr.push(item.thang);
				arr.push(item.idPhong.tenPhong);
				if (options.indexOf('soDien') > 0) {
					arr.push(item.soDien > item.soDienCu ? item.soDien - item.soDienCu : 0);
					total[header.indexOf('Số điện trong tháng')] += item.soDien - item.soDienCu > 0 ? item.soDien - item.soDienCu : 0
				}
				if (options.indexOf('soNuoc') > 0) {
					arr.push(item.soNuoc > item.soNuocCu ? item.soNuoc - item.soNuocCu : 0);
					total[header.indexOf('Số nước trong tháng')] += item.soNuoc - item.soNuocCu > 0 ? item.soNuoc - item.soNuocCu : 0
				}
				if (options.indexOf('tienRac') > 0) {
					arr.push(item.tienRac);
					total[header.indexOf('Tiền rác')] += item.tienRac
				}
				if (options.indexOf('tongTien') > 0) {
					arr.push(item.tienDien);
					total[header.indexOf('Tiền điện')] += item.tienDien
					arr.push(item.tienNuoc);
					arr.push(item.tongTien);
					arr.push(item.tongTienChu);
					total[header.indexOf('Tiền nước')] += item.tienNuoc
					total[header.indexOf('Tổng tiền')] += item.tongTien
				}
				array.push(arr)
			}
			// if (options.indexOf('tongTien')>0)
			// {
			// 	var t = JSON.stringify(total[header.indexOf('Tổng tiền')])
			// 	//console.log('tong tien ', NumberReader.readNumbers(100000000))
			// 	//total[header.indexOf('Tổng tiền chữ')] = NumberReader.readNumbers(100000000)
			// }
			array.push(total);
			var opts = { row: result.length + 1, col: header.length }
			var xlsx = writeXlsx.save(array, opts);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.status(200).json({ filename: 'Report.xlsx', file: xlsx });
			// res.json({
			// 	rs: 'success',
			// 	data: result
			// })
		}).catch(err =>
			res.json({
				rs: 'fail',
				msg: err
			}))

}

exports.get_parameter = (req, res) => {
	ThongSo.find().sort('id').then(result => {
		//console.log(result);
		res.status(200).json({
			rs: 'success',
			data: result
		})
	}).catch(err => res.status(400).json({ rs: 'fail', msg: err }))
}

exports.apply_config = (req, res) => {
	var table = req.body;
	ThongSo.deleteMany({}, err => {
		if (err) {
			res.status(400).end()
		} else {
			ThongSo.insertMany(table, errInsert => {
				if (errInsert) {
					res.json({
						rs: 'fail',
						msg: errInsert
					})
				} else {
					res.json({
						rs: 'success'
					})
				}
			})
		}
	})
}

exports.refresh_data = (req, res) => {
	ChiPhiPhong.find().then(results => {
		console.log(results[0])
		var idx = 0;
		results.map((item) => {
			return new Promise((resolve) => update_data(item, resolve))
		})
		Promise.all(results).then(() => {
			res.json({
				st: 'done'
			})
		})
	}).catch(err => { console.log(err) })
};