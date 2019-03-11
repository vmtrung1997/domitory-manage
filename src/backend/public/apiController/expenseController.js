const ObjectId = require('mongoose').Types.ObjectId;
const ChiPhiPhong = require('../models/ChiPhiPhong')

exports.quan_ly_dien_nuoc = (req, res, next) => {
	res.json({
		msg: 'from quan ly dien nuoc'
	})
};
// param: req.body.search{
// 	thang
// 	nam
// 	phong
// 	status
// }
exports.select_expense_table = (req, res) => {
	var search = req.body.search
	var options = req.body.options
	options.populate = 'idPhong'
	// paginate({
	// 	populate: 'tenPhong'
	// }, options).then(result => {
	// 	res.status(200).json({
	// 		res: result
	// 	})
	// })
	ChiPhiPhong.paginate({thang: 9, nam: 2015}, options).then
	(value => {
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