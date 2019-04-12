const ObjectId = require('mongoose').Types.ObjectId;
const md5 = require('md5');


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
		query.username = { $regex: '.*' + req.body.search + '.*', $options: 'i' }
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
	const id = req.query.id
	Account.findOne({ _id: id })
	.populate('idProfile')
	.then( data => {
		res.json({rs: data})
	})
}

exports.add_Account = (req, res) => {
	var data = req.body
	var account = new Account({
		username: data.username,
		password: md5(data.password),
		loai: data.rule,
		isDelete: 0
	})

	Profile.findOne({ CMND: data.CMND }, (err, val) => {
		if(err){
			console.log('==add_account:', err)
			res.status(402).json({
				ms: 'false'
			})
		}

		if(!val || val.CMND === undefined){
			var person = new Profile({
				hoTen: data.name,
				CMND: data.CMND,
				email: data.Email,
				MSSV: data.MSSV,
				truong: data.school
			})
			person.save()
			
			account.idProfile = person._id
			account.save()

			person.idTaiKhoan = account._id
			person.save()

			console.log('==add_account: success')
			res.status(201).json({
				ms: 'ok'
			})

		} 
		if(val){
			console.log('==add_account: adready exist')
			res.status(409).json({
				ms: 'adready exist'
			})			
		}
	})
}

exports.update_Account = (req, res) => {
	const id = req.query.id
	if(req.body){
		const rule = req.body.rule
		if( rule === 'BV' ||  rule === 'AM' ||  rule === 'SA' ||  rule === 'SV'){
			Account.update({ _id: id }, {loai: rule}, (err, val) => {
				if(!err){
					res.json({ rs: 'ok'})
					console.log('==update_account: success')
				}
				else{
					console.log('==update_account:', err)
					res.status(500)
				}
			})
		}
	}	
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

