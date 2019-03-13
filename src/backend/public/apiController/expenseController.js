const ObjectId = require('mongoose').Types.ObjectId;
const ChiPhiPhong = require('../models/ChiPhiPhong')
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
	options.populate = {path: 'idPhong', select: 'tenPhong', sort: 'thang nam'}
	var searchObj = {};
	if (search.month !== 0){
		searchObj.thang = search.month;
	}
	if (search.year !== 0){
		searchObj.nam = search.year
	}
	if (search.status !== 2)
		searchObj.trangThai = search.status

	if (search.room !== 0 && search.room.value !== 0) 
		searchObj.idPhong = search.room.value
	
	console.log('==searchObj: ', searchObj);
	console.log('==options: ', options)
	ChiPhiPhong.paginate(searchObj, options).then(value => {
		console.log(value);
		res.json({
			rs: value
		})
	}).catch(err => { console.log(err) })
};

function update_data(item, cb){
	var id = new ObjectId(item._id);
	var idPhong = new ObjectId(item.idPhong);
	setTimeout( () => {
		ChiPhiPhong.updateOne({ _id: id }, {
			$set: {
				'idPhong': idPhong
			}
		}, (_,err) => {
			cb()
		})
	}, 100)
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