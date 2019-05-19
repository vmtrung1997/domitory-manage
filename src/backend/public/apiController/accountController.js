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

exports.add_Account = async (req, res) => {
	var data = req.body
	var isExist = false
	var account = new Account({
		username: data.username,
		password: md5(data.password),
		loai: data.rule,
		isDelete: 0
	})

	await Account.findOne({ username: data.username }, (err, val) => {
		if(err){
			console.log('==add_account:', err)
			res.status(402).json({
				ms: 'Lổi hệ thống'
			})
		}
		if(val){
			isExist = true
			console.log('==add_account:  username already exist')
			res.status(402).json({
				ms: 'Tài khoản đã tồn tại trên hệ thống!'
			})
		}
	})

	if(!isExist){
		Profile.findOne({ CMND: data.CMND }, (err, val) => {
			if(err){
				console.log('==add_account:', err)
				res.status(402).json({
					ms: 'Lổi hệ thống'
				})
			}

			if(!val || val.CMND === undefined){
				var person = new Profile({
					hoTen: data.name,
					CMND: data.CMND,
					email: data.Email,
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
				console.log('==add_account: profile already exist account')
				res.status(402).json({
					ms: 'Hồ sơ này đã cấp được cấp tài khoản'
				})			
			}
		})
	}
}

exports.update_Account = (req, res) => {
	const id = req.query.id
	if(req.body){
		const rule = req.body.rule
		if( rule === 'BV' ||  rule === 'AM' ||  rule === 'SA' ||  rule === 'SV'){
			Account.updateOne({ _id: id }, {loai: rule}, (err, val) => {
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
	Account.updateOne({ _id: id }, {isDelete: 1}, (err, val) => {
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

