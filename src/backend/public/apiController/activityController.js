const ObjectId = require('mongoose').Types.ObjectId;
const Activity = require('./../models/HoatDong');
const resultActivity = require('./../models/KetQuaHD');
const Profile = require('./../models/Profile')

exports.get_activity = (req, res) => {
	const option = {
		options: { sort: { ngay: -1 }},
		page: req.query.page
	}
	Activity.paginate({}, option).then( result => {
		console.log('==get_activity: success')
		res.json({
			rs: result
		})
	}).catch(err => console.log('==get_activity: ',err))	
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
	var tmp = {
		ten: req.body.name,
    	diaDiem: req.body.location,
    	ngay: req.body.time,
    	batBuoc: req.body.isRequire,
    	soLuong: 0,
    	diem: req.body.point,
    	moTa: req.body.des
	}
	var act = new Activity(tmp)
	act.save().then(() => {
		console.log('==post_activity: success')
		res.json({rs: 'ok'})
	})
	.catch( err => {console.log('==post_activity: ',err)})
};

exports.delete_activity = (req, res) => {
	const id = req.query.id
	Activity.deleteOne({ _id: id }, function (err) {
		if(!err){
			res.json({ rs: 'ok'})
			console.log('==delete_activity: success')
		}
		else{
			res.json({ rs: 'not found activity'})
			console.log('==delete_activity: err')
		}
	});
};
exports.update_activity = (req, res) => {
	const id = req.query.id
	var data = {
		ten: req.body.name,
    	diaDiem: req.body.location,
    	ngay: req.body.time,
    	batBuoc: req.body.isRequire,
    	diem: req.body.point,
    	moTa: req.body.des
	}

	Activity.update({ _id: id }, data, (err, val) => {
		if(!err){
			res.json({ rs: 'ok'})
			console.log('==update_activity: success')
		}
		else{
			res.json({ rs: 'not found activity'})
			console.log('==update_activity: not found activity')
		}
	})
};
