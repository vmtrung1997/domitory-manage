const ObjectId = require('mongoose').Types.ObjectId;
const ChiPhiPhong = require('../models/ChiPhiPhong');
const ChiPhiHienTai = require('../models/ChiSoHienTai');
const Phong = require('../models/Phong');
const phongRepo = require('../repos/phongRepo');
const writeXlsx = require('../repos/xlsxRepo');
const ThongSo = require('../models/ThongSo');
const LoaiPhong = require('../models/LoaiPhong');
const ThongSoLoaiPhong = require('../models/ThongSoLoaiPhong');
const NumberReader = require('read-vn-number').default
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
function TinhTienDien(arr, number) {
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
			total = total + (number - arr[i].giaTriDau + 1) * arr[i].giaTriThuc;
			break;
		}
	}
	return total;
}
function TinhTienNuoc(arr, number, soNguoi) {
	let total = 0;
	let temp = number;
	for (let i = 0; i < arr.length; i++) {
		if (i === arr.length - 1) {
			return total + temp * arr[i].giaTriThuc
		}
		var diff = (arr[i].giaTriCuoi - arr[i].giaTriDau) * soNguoi
		if (temp > diff) {
			total = total + diff * arr[i].giaTriThuc;
			temp = temp - diff
		} else {
			return total + temp * arr[i].giaTriThuc
		}
	}
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
		.findOne({ idPhong: exp.phong.value, $or: [{ soDien: { $gt: exp.soDien } }, { soNuoc: { $gt: exp.soNuoc } }] })
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
function toMoneyString(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
function ceilMoney(number) {
	return Math.ceil(number / 500) * 500;
}
function Calculation(phong, soDienCu, soNuocCu) {
	return new Promise((resolve, reject) => {
		var row = {
			idPhong: phong.phong.value,
			thang: phong.thang,
			nam: phong.nam,
			soDien: phong.soDien,
			soNuoc: phong.soNuoc,
			soDienCu: soDienCu,
			soNuocCu: soNuocCu,
			tienDien: 0,
			tienNuoc: 0,
			tongTien: 0,
			tienRac: 0,
			tongTienChu: '',
			trangThai: 0,
		}
		console.log(phong);
		LoaiPhong.findOne({ _id: phong.phong.loaiPhong }).then(loaiPhong => {
			if (loaiPhong) {
				row.tienRac = loaiPhong.tienRac;
				if (loaiPhong.dien || loaiPhong.nuoc) {
					ThongSoLoaiPhong.find({ idLoaiPhong: loaiPhong._id }).sort({ id: 1 }).then(async arrThongSo => {
						if (arrThongSo.length > 0) {
							var arrDien = arrThongSo.filter(value => value.loaiChiPhi === 0) || [];
							var arrNuoc = arrThongSo.filter(value => value.loaiChiPhi === 1) || [];
							if (phong.isResetDien) {
								row.thayDien = { dienCu: phong.soDienResetDau, dienMoi: phong.soDienResetCuoi }
								if (arrDien.length > 0) {
									row.tienDien = Math.round(TinhTienDien(arrDien, phong.soDien - soDienCu + phong.soDienResetCuoi - phong.soDienResetDau));
								}
							} else {
								row.thayDien = null;
								if (arrDien.length > 0) {
									row.tienDien = Math.round(TinhTienDien(arrDien, phong.soDien - soDienCu));
								}
							}
							if (phong.isResetNuoc) {
								row.thayNuoc = { nuocCu: phong.soNuocResetDau, nuocMoi: phong.soNuocResetCuoi }
								if (arrNuoc.length > 0) {
									await Phong.findOne({ _id: phong.phong.value }).select(['_id', 'soNguoi']).then(p => {
										row.tienNuoc = Math.round(TinhTienNuoc(arrNuoc, phong.soNuoc - soNuocCu + phong.soNuocResetCuoi - phong.soNuocResetDau, p.soNguoi));
									})
								}
							} else {
								row.thayNuoc = null
								if (arrNuoc.length > 0) {
									await Phong.findOne({ _id: phong.phong.value }).select(['_id', 'soNguoi']).then(p => {
										row.tienNuoc = Math.round(TinhTienNuoc(arrNuoc, phong.soNuoc - soNuocCu, p.soNguoi));
									})
								}
							}
							row.tongTien = ceilMoney(row.tienDien + row.tienNuoc + row.tienRac)
							row.tongTienChu = toMoneyString(NumberReader.read(row.tongTien));
							console.log(row);
							resolve(row);
						}
					})
				} else {
					resolve(row);
				}
			} else reject({ status: false })
		})
	})
}
exports.add_data = (req, res) => {
	var table = req.body
	console.log(table);
	var tableAdd = [];
	var arrId = table.map(val => { return val.phong.value })
	ChiPhiHienTai.find({ idPhong: { $in: arrId } }).then(vals => {
		if (vals.length > 0) {
			table.forEach(row => {
				var obj = vals.find((val) => val.idPhong === row.phong.value)
				if (obj) {
					tableAdd.push(Calculation(row, obj.soDien, obj.soNuoc))
				}
			});
			Promise.all(tableAdd).then(tableNewAdd => {
				if (tableNewAdd.length > 0) {
					ChiPhiPhong.insertMany(tableNewAdd).then((result) => {
						if (result.length > 0) {
							res.json({
								rs: 'success',
								data: result,
							})
						}
					}).catch(err => { res.json({ rs: 'fail', msg: err }) })
				}
			}).catch(err => {
				res.json({ rs: 'fail' })
			})
		}
	})
}
exports.confirm = (req, res) => {
	var id = new ObjectId(req.body.id);
	ChiPhiPhong.findOneAndUpdate({ _id: id }, {
		$set: {
			'trangThai': 1
		}
	}, (err, doc) => {
		if (err) {
			res.json({
				rs: 'fail',
				msg: err
			})
		} else {
			console.log(doc.thayNuoc.nuocMoi)
			var soDien = doc.thayDien.dienMoi ? doc.thayDien.dienMoi : doc.soDien;
			var soNuoc = doc.thayNuoc.nuocMoi ? doc.thayNuoc.nuocMoi : doc.soNuoc;
			console.log('soDien', soDien);
			console.log('soNuoc', soNuoc);
			ChiPhiHienTai.findOneAndUpdate({ idPhong: doc.idPhong }, {
				$set: {
					soDien: soDien,
					soNuoc: soNuoc
				}
			}, (err) => {
				if (err) {
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
exports.update_expense = async (req, res) => {
	var exp = req.body;
	var id = new ObjectId(exp._id);
	Phong.findOne({ _id: exp.idPhong }).then(value => {
		if (value) {
			LoaiPhong.findOne({ _id: value.loaiPhong }).then(async loaiPhong => {
				if (loaiPhong) {
					exp.tienRac = loaiPhong.tienRac;
					if (loaiPhong.dien || loaiPhong.nuoc) {
						await ThongSoLoaiPhong.find({ idLoaiPhong: loaiPhong._id }).then(async arrThongSo => {
							if (loaiPhong.dien) {
								var arrDien = arrThongSo.filter(value => value.loaiChiPhi === 0).sort((a, b) => { return a.id > b.id });
								if (exp.thayDien)
									exp.tienDien = Math.round(TinhTienDien(arrDien, exp.soDien - exp.soDienCu + exp.thayDien.dienMoi - exp.thayDien.dienCu));
								else
									exp.tienDien = Math.round(TinhTienDien(arrDien, exp.soDien - exp.soDienCu));
							}
							if (loaiPhong.nuoc) {
								var arrNuoc = arrThongSo.filter(value => value.loaiChiPhi === 1).sort((a, b) => { return a.id > b.id })
								await Phong.findOne({ _id: exp.idPhong }).select(['_id', 'soNguoi']).then(p => {
									if (exp.thayNuoc)
										exp.tienNuoc = Math.round(TinhTienNuoc(arrNuoc, exp.soNuoc - exp.soNuocCu + exp.thayNuoc.nuocCu - exp.thayNuoc.nuocCu, p.soNguoi));
									else
										exp.tienNuoc = Math.round(TinhTienNuoc(arrNuoc, exp.soNuoc - exp.soNuocCu, p.soNguoi));
								})
							}
						})
					}
					exp.tongTien = ceilMoney(exp.tienRac + exp.tienDien + exp.tienNuoc);
					exp.tongTienChu = toMoneyString(NumberReader.read(exp.tongTien));
					ChiPhiPhong.updateOne({ _id: id }, exp, async (err) => {
						if (err) {
							res.json({
								rs: 'fail',
								msg: err
							})
						} else {
							if (exp.trangThai === 1) {
								var soDienMoi = exp.thayDien ? exp.thayDien.dienMoi : exp.soDien;
								var soNuocMoi = exp.thayNuoc ? exp.thayNuoc.nuocMoi : exp.soNuoc;
								await ChiPhiHienTai.findOneAndUpdate({ idPhong: exp.idPhong }, {
									$set: {
										soDien: soDienMoi,
										soNuoc: soNuocMoi
									}
								}, err => {
									if (err)
										res.json({ rs: 'fail', msg: err })
									else
										res.json({
											rs: 'success'
										})
								})
							} else
								res.json({
									rs: 'success'
								})
						}
					})
				}
			})
		}
	})
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
	var total = ['', '', 'Tổng']
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
		total.push(0)
	}
	if (condition.soNuoc) {
		options.push('soNuoc')
		options.push('soNuocCu')

		header.push('Số nước trong tháng')
		total.push(0)
	}
	if (condition.tienRac) {
		options.push('tienRac')

		header.push('Tiền rác')
		total.push(0)
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

		total.push(0)
		total.push(0)
		total.push(0)
		total.push('')
	}
	console.log('total == ', total)
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
			if (result.length > 0) {
				var array = []
				array.push(header);
				// var totalObj = {
				// 	soDien: 0,
				// 	soNuoc: 0,
				// 	tienDien: 0,
				// 	tienNuoc: 0,
				// 	tienRac: 0,
				// 	tongTien: 0
				// }
				for (let item of result) {
					var arr = []
					arr.push(item.nam);
					arr.push(item.thang);
					arr.push(item.idPhong.tenPhong);
					if (options.indexOf('soDien') > 0) {
						arr.push(item.soDien > item.soDienCu ? item.soDien - item.soDienCu : 0);
						total[header.indexOf('Số điện trong tháng')] = item.soDien > item.soDienCu ? total[header.indexOf('Số điện trong tháng')] + item.soDien - item.soDienCu : total[header.indexOf('Số điện trong tháng')]
						//totalObj.soDien = item.soDien > item.soDienCu ? totalObj.soDien + item.soDien - item.soDienCu : totalObj.soDien
					}
					if (options.indexOf('soNuoc') > 0) {
						arr.push(item.soNuoc > item.soNuocCu ? item.soNuoc - item.soNuocCu : 0);
						total[header.indexOf('Số nước trong tháng')] = item.soNuoc > item.soNuocCu ? total[header.indexOf('Số nước trong tháng')] + item.soNuoc - item.soNuocCu : total[header.indexOf('Số nước trong tháng')]
						//totalObj.soNuoc = item.soNuoc > item.soNuocCu ? totalObj.soNuoc + item.soNuoc - item.soNuocCu : totalObj.soNuoc 
					}
					if (options.indexOf('tienRac') > 0) {
						arr.push(item.tienRac);
						total[header.indexOf('Tiền rác')] = total[header.indexOf('Tiền rác')] + item.tienRac
						//totalObj.tienRac = totalObj.tienRac + item.tienRac;
					}
					if (options.indexOf('tongTien') > 0) {
						arr.push(item.tienDien);
						arr.push(item.tienNuoc);
						arr.push(item.tongTien);
						arr.push(item.tongTienChu);
						total[header.indexOf('Tiền điện')] = total[header.indexOf('Tiền điện')] + item.tienDien
						total[header.indexOf('Tiền nước')] = total[header.indexOf('Tiền nước')] + item.tienNuoc
						total[header.indexOf('Tổng tiền')] = total[header.indexOf('Tổng tiền')] + item.tongTien
					}
					array.push(arr)
				}
				if (options.indexOf('tongTien') > 0) {
					total[header.indexOf('Tổng tiền chữ')] = toMoneyString(NumberReader.read(Math.round(total[header.indexOf('Tổng tiền')] / 1000) * 1000))
				}

				array.push(total);
				var opts = { row: result.length + 1, col: header.length }
				var xlsx = writeXlsx.save(array, opts);
				res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
				res.status(200).json({ filename: 'Report.xlsx', file: xlsx });
			} else {
				res.json({
					rs: 'fail',
					msg: 'No data'
				})
			}

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

exports.get_type_room = (req, res) => {
	LoaiPhong.find().then(value => {
		if (value.length > 0) {
			res.json({
				data: value
			})
		} else {
			res.json({
				msg: 'No data'
			})
		}
	}).catch(err => res.json({ msg: err }))
}

exports.get_detail_type_room = (req, res) => {
	ThongSoLoaiPhong.find({ idLoaiPhong: req.body.idLoaiPhong })
		.sort({ id: 1 })
		.then(arrThongSo => {
			if (arrThongSo.length > 0) {
				res.json({
					rs: 'success',
					data: arrThongSo
				})
			} else {
				res.json({
					rs: 'fail',
					msg: 'No data'
				})
			}
		}).catch(err => { res.json({ err: err }) })
}

exports.update_detail_type_room = (req, res) => {
	var data = req.body;
	console.log(data);
	LoaiPhong.updateOne({ _id: data.idLoaiPhong },
		{ $set: { 'tienRac': data.tienRac } },
		(err, result) => {
			if (err) {
				res.json({
					rs: 'fail'
				})
			} else {
				ThongSoLoaiPhong.find({ idLoaiPhong: data.idLoaiPhong }).then(value => {
					if (value.length > 0) {
						ThongSoLoaiPhong.deleteMany({ idLoaiPhong: data.idLoaiPhong }, (err) => {
							if (err) {
								res.json({
									rs: 'fail'
								})
							} else {
								var table = data.table.map(value => {
									return {
										id: parseInt(value.id),
										idLoaiPhong: value.idLoaiPhong,
										loaiChiPhi: parseInt(value.loaiChiPhi),
										giaTriCuoi: parseInt(value.giaTriCuoi),
										giaTriDau: parseInt(value.giaTriDau),
										giaTriThuc: parseFloat(value.giaTriThuc),
										donVi: value.donVi,
										moTa: value.moTa
									}
								})
								if (table.length > 0) {
									ThongSoLoaiPhong.insertMany(table).then(result => {
										if (result.length > 0) {
											res.json({
												rs: 'success'
											})
										}
									}).catch(errorInsert => {
										res.json({
											rs: 'fail',
											msg: errorInsert
										})
									})
								} else {
									res.json({
										rs: 'success'
									})
								}
							}
						})
					} else {
						var table = data.table.map(value => {
							return {
								id: parseInt(value.id),
								idLoaiPhong: value.idLoaiPhong,
								loaiChiPhi: parseInt(value.loaiChiPhi),
								giaTriCuoi: parseInt(value.giaTriCuoi),
								giaTriDau: parseInt(value.giaTriDau),
								giaTriThuc: parseFloat(value.giaTriThuc),
								donVi: value.donVi,
								moTa: value.moTa
							}
						})
						if (table.length > 0) {
							ThongSoLoaiPhong.insertMany(table).then(result => {
								if (result.length > 0) {
									res.json({
										rs: 'success'
									})
								}
							}).catch(errorInsert => {
								res.json({
									rs: 'fail',
									msg: errorInsert
								})
							})
						} else {
							res.json({
								rs: 'success'
							})
						}
					}
				})

			}
		})
}

exports.get_info_room = async (req, res) => {
	var info = req.body;
	var detail = {};
	await Phong.findOne({ _id: info.idPhong }).populate('loaiPhong').then(phong => {
		detail.loaiPhong = phong.loaiPhong
	})
	await ChiPhiHienTai.findOne({ idPhong: info.idPhong }).then(chiphi => {
		if (chiphi)
			detail.chiPhi = chiphi
	})
	res.json({
		data: detail
	})
}

exports.reset_room = (req, res) => {
	var detail = req.body;
	var roomUpdate = {}
	// ChiPhiHienTai.findOne({ idPhong: detail.idPhong }).then(value => {
	// 	if (value) {

	// 	}
	// })
	if (detail.dienCheck)
		//roomUpdate.soDien = detail.dienCu === 0 ? detail.dienMoi : detail.dienMoi - (detail.dienCu - value.soDien)
		roomUpdate.soDien = detail.dienMoi;
	if (detail.nuocCheck)
		//roomUpdate.soNuoc = detail.nuocCu === 0 ? detail.nuocMoi : detail.nuocCu - (detail.nuocCu - value.soNuoc);
		roomUpdate.soNuoc = detail.nuocMoi
	if (Object.keys(roomUpdate).length > 0) {
		ChiPhiHienTai.updateOne({ idPhong: detail.idPhong }, {
			$set: roomUpdate
		}, (err) => {
			if (err)
				res.json({ rs: 'fail' })
			else
				res.json({ rs: 'success' })
		})
	}
}
function getDetailTypeRoom(value){
	return new Promise(resolve => {
		if (value.idPhong.loaiPhong.dien || value.idPhong.loaiPhong.nuoc) {
			ThongSoLoaiPhong.find({ idLoaiPhong: value.idPhong.loaiPhong._id }).then(arr => {
				resolve({detail: value, thongSo: arr})
			}).catch(err => console.log(err))
		} else 
			{resolve(value)}
	})
}
exports.get_data_print = (req, res) => {
	var { data, type } = req.body
	var searchObj = {};
	if (type === 'table') {
		if (data.month !== 0) 
			searchObj.thang = search.month;
		if (data.year !== 0)
			searchObj.nam = search.year
		if (data.status !== 2)
			searchObj.trangThai = search.status
		if (data.room !== 0 && data.room.value !== 0)
			searchObj.idPhong = search.room.value
	} else {
		if (data.length > 0)
			searchObj._id = {$in: data}
	}
	if (Object.keys(searchObj).length){
		ChiPhiPhong.find(searchObj).populate({
			path: 'idPhong',
			select: 'loaiPhong tenPhong soNguoi',
			populate: {
				path: 'loaiPhong'
			}
		}).then(expenses => {
			if (expenses.length > 0) {
				var data = []
				expenses.forEach(value => {
					data.push(getDetailTypeRoom(value))
				})
				Promise.all(data).then(value => {
					res.json({
						rs: 'success',
						data: value
					})
				})
			}
		}).catch(err => {
			res.json({
				rs: 'fail',
				msg: err
			})
		})
	} else {
		res.json({rs: 'fail', msg: 'Không có dữ liệu chọn'})
	}
}