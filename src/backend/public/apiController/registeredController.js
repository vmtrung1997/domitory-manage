const ObjectId = require('mongoose').Types.ObjectId;

const Profile = require('./../models/Profile');
const Register = require('./../models/YeuCauLuuTru');
const resultActivity = require('./../models/KetQuaHD');


exports.get_list_register = (req, res) => {
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
		page: req.query.page
	}
	Register.paginate({}, options)
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
		    	console.log(rs)
	 			rs.map( ac => {
	 				if(ac.idHD){
		 				if(ac.isHD.batBuoc && !ac.isTG){
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
	    
	    console.log(arrPoint)
		console.log('==get_register: success')
		res.json({
			rs: result,
		})
	}).catch(err => {
		console.log('==get_register: ',err)
		res.status(500)
	})                             
}