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
	}).catch(err => {
		console.log('==get_activity: ',err)
		res.status(500)
	})	
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
	.catch( err => {
		console.log('==post_activity: ',err)
		res.status(500)
	})
};

exports.delete_activity = (req, res) => {
	const id = req.query.id
	Activity.deleteOne({ _id: id }, function (err) {
		if(!err){
			res.json({ rs: 'ok'})
			console.log('==delete_activity: success')
		}
		else{
			console.log('==delete_activity: ', err)
			res.status(500)
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
			console.log('==update_activity:', err)
			res.status(500)
		}
	})
};

exports.rollcall_activity = async (req, res) => {
	var data = {
		hd: req.body.idHD,
		the: req.body.idThe,
		diem: req.body.point,
		sv: ''
	}

	await Profile.findOne({ maThe: data.the}, (err, val) => {
		if(err){
			console.log('==rollcall_activ:', err)
			res.status(500)
		}
		if(!val){
			console.log(1)
			res.status(200).json({rs: 'not found student'})
		}
		data.sv = val
	})
	if(data.sv){
		resultActivity.findOne({ idHD: data.hd, idSV: data.sv._id }, (err,val) => {
			if(err){
				console.log('==rollcall_activity:', err)
				res.status(500)
			}
			if(!val) {
				var rs = new resultActivity({
					idHD: data.hd,
					idSV: data.sv._id,
					status: 1 
				})
				rs.save()
			} else {
				if(val.status === 1){
					res.status(200).json({ rs: 'ok'})
					return true
				}
				val.status = 1
				val.save()
			}
			data.sv.diemHD = (data.sv.diemHD || 0) + data.diem
			data.sv.save()
			res.json({ rs: 'ok'})
			console.log('==rollcall_activity: success')
		})
	}

};
