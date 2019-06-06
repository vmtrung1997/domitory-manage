const ObjectId = require('mongoose').Types.ObjectId;

const Account = require('./../models/TaiKhoan')
const Profile = require('./../models/Profile');
const Register = require('./../models/YeuCauLuuTru');
const resultActivity = require('./../models/KetQuaHD');


exports.get_list_register = async (req, res) => {
	var arrPoint = []
	var now = new Date()
	var lte = 0
	var gte = 0
	if(now.getMonth() >= 7){
		lte = now.getFullYear() + 1
		gte = now.getFullYear()
	} else {
		lte = now.getFullYear()
		gte = now.getFullYear() - 1
	}
	const options = {
		option: { 
			sort: { date: 1 }
		},
		populate: {
			path: 'idProfile',
			populate: {
				path: 'idPhong',
			}
		},
		page: req.body.page
	}
	var query = {}
	if(req.body.accept !== 'all'){
		query.isAc = req.body.accept
	}

	if(parseInt(req.body.year) !== 0){
		var year = parseInt(req.body.year)
		query.date = {
			$lte: new Date( year+1 , 7, 31),
			$gte: new Date(  year, 8, 1)
		}
	}

	var last = await Register.paginate( {} , { sort: {date : 1}}).catch(err => {
		console.log('==get_activity: ',err)
		res.status(500)
	})

	Register.paginate(query, options)
	.then( async result => {
		await Promise.all(result.docs.map( async sv => {
			await resultActivity.find({ idSV: sv.idProfile._id })
		    .populate({
		      path: "idHD",
		      match: {
		        ngayBD: {
		        	$lte: new Date(lte, 7, 31),
		        	$gte: new Date(gte, 8, 1)
		        },
		      },
		      select: "diem batBuoc ngayBD ngayKT"
		    })
		    .then(rs => {
		    	var point = 0 
	 			rs.map( ac => {
	 				if(ac.idHD){
		 				if(ac.idHD.batBuoc && !ac.isTG && now > ac.idHD.ngayBD){
		 					point -= ac.idHD.diem
		 				} else if(ac.isTG){
		 					point += ac.idHD.diem
		 				}
	 				}
	 			})
			    arrPoint.push(point)
	    	})
	      	.catch( err => {
	      		console.log('==get_register: ',err)
				res.status(500)
	      	})
	    }))

		console.log('==get_register: success')
		res.json({
			last: last.docs[last.docs.length - 1],
			point: arrPoint,
			rs: result
		})
	}).catch(err => {
		console.log('==get_register: ',err)
		res.status(500)
	})                             
}

exports.accept_request = (req, res) => {
	var accRequest = req.body.check
	for (var key in accRequest) {
		Register.updateOne({ _id: key}, {isAc: accRequest[key]}, (err, val) => {
			if(err){
				console.log('==update_request:', err)
				res.status(500)
			}
		})
		if(accRequest[key] === true){
			var d = new Date();
 			d.setDate(d.getDate() + 30);
			Register.findOne({_id: key}, async (err, val) =>{
				if(err){
					console.log('==update_request:', err)
				} else {
					Profile.findOne({_id: val.idProfile}, (err, tmp) =>{
						if(err) {
							console.log('==update_request:', err)
						} else {
							tmp.isActive = false
							tmp.ngayHetHan = null
							tmp.hanDangKy = d
							tmp.save()
							Account.updateOne({idProfile: tmp._id}, {isDelete: 0}, (err, val) =>{
								if(err){
									console.log('==update_request:', err)
								}
							})
						}
					})
				}
			})
		}
	}
	res.status(200).json({ rs: 'ok'})
	console.log('==update_request: success')
}
