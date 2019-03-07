const ChiSoPhong = require('../models/ChiSoPhong')

exports.quan_ly_dien_nuoc = (req, res, next) => {
	res.json({
		msg: 'from quan ly dien nuoc'
	})
};
// param: req.body{
// 	thang
// 	nam
// 	phong
// 	status
// }
exports.get_expense_table = (req, res) => {
	var search = req.body
	console.log(...search);
	ChiSoPhong.find({
		...search
	}).then(result => {
		res.status(200).json({
			res: result
		})
	}).catch(err=>{console.log(err)})
	
};

exports.add_expense_table = (req, res) => {
	var search = req.body
	console.log(...search);
	ChiSoPhong.find({
		...search
	}).then(result => {
		res.status(200).json({
			res: result
		})
	}).catch(err=>{console.log(err)})
};