const ObjectId = require('mongoose').Types.ObjectId;
const ChiPhiPhong = require('../models/ChiPhiPhong');
const ChiPhiHienTai = require('../models/ChiSoHienTai');
const Phong = require('../models/Phong');
const phongRepo = require('../repos/phongRepo');
const writeXlsx = require('../repos/xlsxRepo');
const ThongSo = require('../models/ThongSo');
const LoaiPhong = require('../models/LoaiPhong');
const ThongSoLoaiPhong = require('../models/ThongSoLoaiPhong');
const Profile = require('../models/Profile');
const NumberReader = require('read-vn-number').default
const logsDb = require('../repos/logsRepo').logs_database;
exports.quan_ly_dien_nuoc = (req, res, next) => {
	res.json({
		msg: 'from quan ly dien nuoc'
	})
};
exports.get_room_option = (req, res) => {
	phongRepo.get_room().then(result => {
		ChiPhiPhong.find({thang: req.body.month, nam: req.body.year}).then(cpPhongs => {
			if (cpPhongs.length>0){
				var rs = [];
				result.forEach(phong => {
					let find = cpPhongs.find(item => item.idPhong === phong._id.toString());
					if (!find)
						rs.push(phong);
				})
				res.json({
					status: 'success',
					result: rs
				})
			}
			else 
			res.json({
				status: 'success',
				result: result
			})
		})
		
	})
}
exports.get_year = (req, res) => {
	ChiPhiPhong
		.distinct('nam')
		.then(value => {
			res.json({ year: value })
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
	if (search.status !== -1)
		searchObj.trangThai = search.status

	if (search.room !== 0 && search.room.value !== 0)
		searchObj.idPhong = search.room.value
	// console.log('==searchObj: ', searchObj);
	// console.log('==options: ', options)
	ChiPhiPhong.paginate(searchObj, options).then(value => {
		res.json({
			rs: value
		})
	}).catch(err => {
		res.json({
			mes: 'fail',
			rs: []
		})
	})
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

function getPersonInRoom(id) {
	return new Promise((resolve) => {
		Phong.findOne({ _id: id }).populate('loaiPhong').then(value => {
			if (value.loaiPhong.loai === 2)
				resolve(value.soNguoiToiDa)
			else
				Profile.countDocuments({ idPhong: id }, function (err, count) {
					if (err)
						resolve(-1);
					else
						resolve(count);
				})
		});
	})
}

function TinhTienDien(arr, number) {
	let total = 0;
	let temp = number;
	if (arr.length > 0 && temp <= arr[0].giaTriCuoi)
		return temp * arr[0].giaTriThuc;
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
	var total = 0;
	var temp = number;
	for (let i = 0; i < arr.length; i++) {
		var diff = (arr[i].giaTriCuoi - arr[i].giaTriDau) * soNguoi
		if (temp > diff) {
			total = total + diff * arr[i].giaTriThuc;
			temp = temp - diff;
		} else {
			total = total + temp * arr[i].giaTriThuc;
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
	return Math.ceil((number-101) / 1000) * 1000;
}

function CalculationTest(phong, soDienCu, soNuocCu) {
	return new Promise(async (resolve, reject) => {
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
		var phongReset = await ChiPhiPhong.findOne({ phong: phong.phong.value, thang: phong.thang, nam: phong.nam });
		var loaiPhong = await LoaiPhong.findOne({ _id: phong.phong.loaiPhong });
		var arrThongSo = await ThongSoLoaiPhong.find({ idLoaiPhong: loaiPhong._id }).sort({ id: 1 });
		var arrDien, arrNuoc;
		if (arrThongSo.length > 0) {
			arrDien = arrThongSo.filter(value => value.loaiChiPhi === 0) || [];
			arrNuoc = arrThongSo.filter(value => value.loaiChiPhi === 1) || [];
		}
		if (loaiPhong) {
			row.tienRac = loaiPhong.tienRac;
			if (phongReset) {
				if (phongReset.thayDien) {
					row.tienDien = Math.round(TinhTienDien(arrDien, phong.soDien - soDienCu + phongReset.thayDien.dienCu));
				}
				if (phongReset.thayNuoc) {
					row.tienNuoc = Math.round(TinhTienNuoc(arrNuoc, phong.soNuoc - soNuocCu, songuoi));
				}
			}
			else {
				if (loaiPhong.dien || loaiPhong.nuoc) {
					if (arrDien.length > 0) {
						row.tienDien = Math.round(TinhTienDien(arrDien, phong.soDien - soDienCu));
					}
					phong.isResetDien ?
						row.thayDien = { dienCu: phong.soDienResetDau } :
						row.thayDien = null;

					var songuoi = await getPersonInRoom(phong.phong.value);

					if (arrNuoc.length > 0) {
						row.tienNuoc = Math.round(TinhTienNuoc(arrNuoc, phong.soNuoc - soNuocCu, songuoi));
					}
					phong.isResetNuoc ?
						row.thayNuoc = { nuocCu: phong.soNuocResetDau } :
						row.thayNuoc = null;

					console.log(row)
					row.tongTien = ceilMoney(row.tienDien + row.tienNuoc + row.tienRac)
					row.tongTienChu = toMoneyString(NumberReader.read(row.tongTien));
				}
				resolve(row)
			}
		}
		else reject({ status: false })

	})
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
			soNguoi: 0,
			tongTienChu: '',
			trangThai: phong.trangThai,
			soNguoi: phong.soNguoi
		}
		LoaiPhong.findOne({ _id: phong.phong.loaiPhong }).then(loaiPhong => {
			if (loaiPhong) {
				row.tienRac = loaiPhong.tienRac;
				if (loaiPhong.dien || loaiPhong.nuoc) {
					ThongSoLoaiPhong.find({ idLoaiPhong: loaiPhong._id }).sort({ id: 1 }).then(async arrThongSo => {
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
									row.tienNuoc = Math.round(TinhTienNuoc(arrNuoc, phong.soNuoc - soNuocCu + phong.soNuocResetCuoi - phong.soNuocResetDau, row.songuoi));
								}
							} else {
								row.thayNuoc = null
								if (arrNuoc.length > 0) {
									row.tienNuoc = Math.round(TinhTienNuoc(arrNuoc, phong.soNuoc - soNuocCu, row.songuoi));
								}
							}
							row.tongTien = ceilMoney(row.tienDien + row.tienNuoc + row.tienRac)
							row.tongTienChu = toMoneyString(NumberReader.read(row.tongTien));
							resolve(row);
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
	var tableAdd = [];
	var arrId = table.map(val => { return val.phong.value })
	ChiPhiHienTai.find({ idPhong: { $in: arrId } }).then(async vals => {
		if (vals.length > 0) {
			for (let i=0; i< table.length;i++){
				var row = table[i];
				var obj = vals.find((val) => val.idPhong === row.phong.value)
				if (obj) {
					await tableAdd.push(Calculation(row, obj.soDien, obj.soNuoc))
				}
			}
			Promise.all(tableAdd).then(tableNewAdd => {
				if (tableNewAdd.length > 0) {
					ChiPhiPhong.insertMany(tableNewAdd).then((result) => {
						if (result.length > 0) {
							logsDb(req.headers['x-access-token'], 'Thêm chi phí', tableNewAdd)
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
			var soDien = doc.thayDien.dienMoi ? doc.thayDien.dienMoi : doc.soDien;
			var soNuoc = doc.thayNuoc.nuocMoi ? doc.thayNuoc.nuocMoi : doc.soNuoc;
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
					logsDb(req.headers['x-access-token'], 'Xác nhận thanh toán', {
						soDien: soDien,
						soNuoc: soNuoc
					})
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
			logsDb(req.headers['x-access-token'], 'Xóa chi phí', { data: exp })
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
								{
									exp.thayDien = null;
									exp.tienDien = Math.round(TinhTienDien(arrDien, exp.soDien - exp.soDienCu));
								}
							}
							if (loaiPhong.nuoc) {
								var arrNuoc = arrThongSo.filter(value => value.loaiChiPhi === 1).sort((a, b) => { return a.id > b.id })
								if (exp.thayNuoc)
										exp.tienNuoc = Math.round(TinhTienNuoc(arrNuoc, exp.soNuoc - exp.soNuocCu + exp.thayNuoc.nuocCu - exp.thayNuoc.nuocCu, exp.soNguoi));
									else
										{
											exp.thayNuoc = null;
											exp.tienNuoc = Math.round(TinhTienNuoc(arrNuoc, exp.soNuoc - exp.soNuocCu, exp.soNguoi));
										}
									
							}
						})
					}
					exp.tongTien = ceilMoney(exp.tienRac + exp.tienDien + exp.tienNuoc);
					exp.tongTienChu = toMoneyString(NumberReader.read(exp.tongTien));
					exp.isUpdated = exp.trangThai === 2? false : true;
					exp.trangThai = exp.trangThai === 2? 0: exp.trangThai;
					ChiPhiPhong.updateOne({ _id: id }, exp, async (err) => {
						if (err) {
							res.json({
								rs: 'fail',
								msg: err
							})
						} else {
							// if (exp.trangThai === 1) {
							// 	var soDienMoi = exp.thayDien ? exp.thayDien.dienMoi : exp.soDien;
							// 	var soNuocMoi = exp.thayNuoc ? exp.thayNuoc.nuocMoi : exp.soNuoc;
							// 	await ChiPhiHienTai.findOneAndUpdate({ idPhong: exp.idPhong }, {
							// 		$set: {
							// 			soDien: soDienMoi,
							// 			soNuoc: soNuocMoi
							// 		}
							// 	}, err => {
							// 		if (err)
							// 			res.json({ rs: 'fail', msg: err })
							// 		else {
							// 			logsDb(req.headers['x-access-token'], 'Cập nhật thông số', { idPhong: exp, soDien: soDienMoi, soNuoc: soNuocMoi })
							// 			logsDb(req.headers['x-access-token'], 'Cập nhật chi phí', exp)
							// 			res.json({
							// 				rs: 'success'
							// 			})
							// 		}
							// 	})
							// } else {
							// 	logsDb(req.headers['x-access-token'], 'Cập nhật chi phí', exp)
							// 	res.json({
							// 		rs: 'success'
							// 	})
							// }
							logsDb(req.headers['x-access-token'], 'Cập nhật chi phí', exp)
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

exports.report_expense = (req, res) => {
	var condition = req.body;
	var query = {};
	var header = ['Năm', 'Tháng', 'Tên phòng']
	var options = ['nam', 'thang', 'thayDien', 'thayNuoc']
	var total = ['', '', 'Tổng']
	if (condition.disableToMonth === true) {
		query.thang = condition.fromMonth;
		query.nam = condition.fromYear;
		if (condition.room !== 0) {
			query.idPhong = condition.room
		}
		if (condition.status !== -1) {
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
				if (condition.status !== -1) {
					query.trangThai = condition.status
				}
			}
			else {
				query = {}
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
			if (condition.status !== -1) {
				query.$and.push({ trangThai: condition.status })
			}
		} else {
			query = {}
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
	header.push('Trạng thái')
	options.push('trangThai')
	header.push('Ký tên')
	if (Object.keys(query).length) {
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
					for (let item of result) {
						var arr = []
						arr.push(item.nam);
						arr.push(item.thang);
						arr.push(item.idPhong.tenPhong);
						if (options.indexOf('soDien') > 0) {
							arr.push(item.thayDien.dienMoi > 0 ? item.soDien - item.soDienCu + item.thayDien.dienMoi - item.thayDien.dienCu : (item.soDien > item.soDienCu ? item.soDien - item.soDienCu : 0));
							total[header.indexOf('Số điện trong tháng')] = item.thayDien.dienMoi > 0 ? total[header.indexOf('Số điện trong tháng')] + item.soDien - item.soDienCu + item.thayDien.dienMoi - item.thayDien.dienCu :
								(item.soDien > item.soDienCu ? total[header.indexOf('Số điện trong tháng')] + item.soDien - item.soDienCu : total[header.indexOf('Số điện trong tháng')])
							//totalObj.soDien = item.soDien > item.soDienCu ? totalObj.soDien + item.soDien - item.soDienCu : totalObj.soDien
						}
						if (options.indexOf('soNuoc') > 0) {
							arr.push(item.thayNuoc.nuocMoi > 0 ? item.thayNuoc.nuocMoi - item.thayNuoc.nuocCu + item.soNuoc - item.soNuocCu : (item.soNuoc > item.soNuocCu ? item.soNuoc - item.soNuocCu : 0));
							total[header.indexOf('Số nước trong tháng')] = item.thayNuoc.nuocMoi > 0 ? total[header.indexOf('Số nước trong tháng')] + item.soNuoc - item.soNuocCu + item.thayNuoc.nuocMoi - item.thayNuoc.nuocCu :
								(item.soNuoc > item.soNuocCu ? total[header.indexOf('Số nước trong tháng')] + item.soNuoc - item.soNuocCu : total[header.indexOf('Số nước trong tháng')])
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
						arr.push(item.trangThai == 0?'Chưa thanh toán':item.trangThai==1?"Đã thanh toán":"Thiếu dữ liệu")
						array.push(arr)
					}
					if (options.indexOf('tongTien') > 0) {
						total[header.indexOf('Tổng tiền chữ')] = toMoneyString(NumberReader.read(total[header.indexOf('Tổng tiền')]))
					}

					array.push(total);
					var opts = { row: result.length + 1, col: header.length }
					var xlsx = writeXlsx.save(array, opts);
					res.status(200).json({ filename: 'Report.xlsx', file: xlsx });
				} else {
					res.json({
						rs: 'fail',
						msg: 'Không có dữ liệu'
					})
				}

			}).catch(err =>
				res.json({
					rs: 'fail',
					msg: 'Có lỗi xảy ra'
				}))
	} else {
		res.json({
			rs: 'fail',
			msg: 'Điều kiện sai'
		})
	}
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
			res.json({
				rs: 'success',
				data: arrThongSo
			})

		}).catch(err => { res.json({ err: err }) })
}

exports.update_detail_type_room = (req, res) => {
	var data = req.body;
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
											logsDb(req.headers['x-access-token'], 'Cập nhật cài đặt', table)
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
									logsDb(req.headers['x-access-token'], 'Cập nhật cài đặt', table)
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
		ChiPhiHienTai.findOne({ idPhong: info.idPhong }).then(async chiphi => {
			if (chiphi) {
				detail.chiPhi = chiphi
			}
			else {
				detail.chiPhi = { soDien: 0, soNuoc: 0 }
			}
			let soNguoi = await getPersonInRoom(info.idPhong)
			res.json({
				data: detail,
				soNguoi: soNguoi
			})
		})
	})
}

exports.reset_room = (req, res) => {
	var detail = req.body;
	var roomUpdate = {}
	if (detail.dienCheck)
		roomUpdate.soDien = detail.dienMoi;
	if (detail.nuocCheck)
		roomUpdate.soNuoc = detail.nuocMoi;
	if (Object.keys(roomUpdate).length > 0) {
		ChiPhiHienTai.updateOne({ idPhong: detail.idPhong }, {
			$set: roomUpdate
		}, (err) => {
			if (err)
				res.json({ rs: 'fail' })
			else {
				logsDb(req.headers['x-access-token'], 'Cập nhật số điện nước ban đầu', { idPhong: detail.idPhong, update: roomUpdate })
				res.json({ rs: 'success' })
			}
		})
	}
}

async function getDetailRoom(value) {
	let soNguoi = await getPersonInRoom(value.idPhong._id);
	return Promise.resolve({ detail: value, soNguoi: soNguoi })
}
exports.get_data_print = (req, res) => {
	var { data, type } = req.body
	var searchObj = {};
	if (type === 'table') {
		if (data.month !== 0)
			searchObj.thang = data.month;
		if (data.year !== 0)
			searchObj.nam = data.year;
		if (data.status !== -1)
			searchObj.trangThai = data.status
		if (data.room !== 0 && data.room.value !== 0)
			searchObj.idPhong = data.room.value
	} else {
		if (data.length > 0)
			searchObj._id = { $in: data }
	}
	if (Object.keys(searchObj).length > 0 || type === 'table') {
		ChiPhiPhong.find(searchObj).populate({
			path: 'idPhong',
			select: 'loaiPhong tenPhong soNguoi',
			populate: {
				path: 'loaiPhong'
			}
		}).then(async expenses => {
			if (expenses.length > 0) {
				// var data = [];
				// expenses.forEach(value => {
				// 	data.push(getDetailRoom(value))
				// })
				// Promise.all(data).then(value => {
				// 	res.json({
				// 		rs: 'success',
				// 		data: value
				// 	})
				// })
				res.json({
					rs: 'success',
					data: expenses
				})
			}
		}).catch(err => {
			res.json({
				rs: 'fail',
				msg: err
			})
		})
	} else {
		res.json({ rs: 'fail', msg: 'Không có dữ liệu chọn' })
	}
}
exports.get_person_room = (req, res) => {
	getPersonInRoom(req.body.id).then(num => {
		res.json({
			data: num
		})
	})
}