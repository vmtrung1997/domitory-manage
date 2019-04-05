const ObjectId = require('mongoose').Types.ObjectId;

const Profile = require('./../models/Profile');
const Account = require('./../models/TaiKhoan')

exports.get_List = (req, res) => {
	const options = {
		option: { 
			sort: { username: 1 }
		},
		populate: {
			path: 'idProfile',
		},
		page: req.query.page
	}
	var query = { 
		isDelete: 0,
	}
	
	if(req.body.search){ 
		query = { 
			username: { $regex: '.*' + req.body.search + '.*', $options: 'i' },
		}
	}
	switch(req.body.rule){
		case 'SA':
			query.loai = 'SA'
			break
		case 'AM':
			query.loai = 'AM'
			break
		case 'BV':
			query.loai = 'BV'
			break
		case 'SV':
			query.loai = 'SV'
			break
		default:
			break
	}

	Account.paginate(query, options)
	.then( result => {
		console.log('==get_account: success')
		res.json({
			rs: result,
		})
	}).catch(err => {
		console.log('==get_account: ',err)
		res.status(500)
	})                             
	
}

exports.get_Detail = (req, res) => {

}
exports.add_Account = (req, res) => {

}
exports.update_Account = (req, res) => {

}

exports.delete_Account = (req, res) =>{
	const id = req.query.id
	Account.update({ _id: id }, {isDelete: 1}, (err, val) => {
		if(!err){
			res.json({ rs: 'ok'})
			console.log('==delete_account: success')
		}
		else{
			console.log('==delete_account:', err)
			res.status(500)
		}
	})
}

