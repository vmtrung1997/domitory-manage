const ObjectId = require('mongoose').Types.ObjectId;
const Activity = require('./../models/HoatDong');
const resultActivity = require('./../models/KetQuaHD');

exports.get_activity = (req, res) => {
	console.log(req.query.page)
	Activity.paginate({}, {page: req.query.page}).then( result => {
		res.json({
			rs: result
		})
	}).catch(err => console.log(err))
		
};