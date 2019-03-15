const ObjectId = require('mongoose').Types.ObjectId;
const ChiPhiPhong = require('../models/ChiPhiPhong')
const ChiPhiHienTai = require('../models/ChiSoHienTai')
const phongRepo = require('../repos/phongRepo')
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
	options.populate = { path: 'idPhong', select: 'tenPhong', options: {sort: {tenPhong: 1}}} 
	options.sort = 'nam thang idPhong'
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
exports.add_data = (req, res) => {
	var table = req.body
	ChiPhiHienTai.find().then(vals => {
		if (vals) {
			var tableAdd = table.map(row => {
				var obj = vals.find((val) => val.idPhong === row.phong.value)
				if (obj)
					return {
						idPhong: row.phong.value,
						thang: row.thang,
						nam: row.nam,
						soDien: row.soDien,
						soNuoc: row.soNuoc,
						soDienCu: obj.soDien,
						soNuocCu: obj.soNuoc,
						tienDien: '',
						tienNuoc: '',
						tienRac: '',
						tongTien: '',
						tongTienChu: '',
						trangThai: 0
					}
			});
			ChiPhiPhong.collection.insert(tableAdd, function (err, result) {
				if (result) {
					res.status(201).json({
						rs: 'success',
						data: result
					})
				} else {
					res.end(400).json({
						rs: 'fail',
						msg: err
					})
				}
			})
		}
	})
};
exports.remove_expense = (req, res) => {
	var exp = req.body;
	var id = new ObjectId(exp._id);
	ChiPhiPhong.deleteOne({_id: id}, (err) => {
		if (err){
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
	var exp = req.body;
	var id = new ObjectId(exp._id);
	console.log('==expense update id ',id);
	console.log(exp);
	ChiPhiPhong.updateOne({_id: id},exp, (err) => {
		if (err){
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