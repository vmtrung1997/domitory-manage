const ObjectId = require('mongoose').Types.ObjectId;

const Profile = require('./../models/Profile');
const Register = require('./../models/YeuCauLuuTru');
const resultActivity = require('./../models/KetQuaHD');


exports.get_list_register = (req, res) => {
	var point = []
	var now = new Date()
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
		// await Promise.all(result.docs.map( async sv => {
		// 	await resultActivity.find({ idSV: sv.idSV })
		//     .populate({
		//       path: "idHD",
		//       match: {
		//         ngayBD: { $gte: now }
		//       },
		//       select: "diem batBuoc ten diaDiem ngayBD ngayKT thang nam"
		//     })
		//     .then(rs => {
		      
		// 	      console.log(hk1, hk2)
		// 	  })
	 //    	})
	 //      	.catch( err => {
	 //      		console.log('==get_register: ',err)
		// 		res.status(500)
	 //      	})
	 //    }))
	    
	 //    console.log(point)
		console.log('==get_register: success')
		res.json({
			rs: result,
		})
	}).catch(err => {
		console.log('==get_register: ',err)
		res.status(500)
	})                             
}