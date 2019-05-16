const ObjectId = require('mongoose').Types.ObjectId;

const Profile = require('./../models/Profile');
const Register = require('./../models/YeuCauLuuTru')

exports.get_list_register = (req, res) => {
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
	.then( result => {
		console.log('==get_register: success')
		res.json({
			rs: result,
		})
	}).catch(err => {
		console.log('==get_register: ',err)
		res.status(500)
	})                             
}