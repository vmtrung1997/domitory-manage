const ObjectId = require('mongoose').Types.ObjectId;
const Activity = require('./../models/HoatDong');
const resultActivity = require('./../models/KetQuaHD');

exports.get_activity = (req, res) => {
	Activity.paginate({}, {page: req.query.page}).then( result => {
		console.log('==get_activity: success')
		res.json({
			rs: result
		})
	}).catch(err => console.log(err))
		
};