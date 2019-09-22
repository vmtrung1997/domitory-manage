const Profile = require('./public/models/Profile');
const Account = require('./public/models/TaiKhoan');
const History = require('./public/models/LichSuPhong')

exports.background = async () => {
	var query = {
		isActive: false,
	    hanDangKy: { 
	        "$lt": new Date()
	    }
	}
	
	await Profile.find(query, (err, val) => {
		if(err) { console.log("==background: ", err )}
		else {
			val.map((item, index) => {
				item.isActive = false
				item.idPhong = null
				item.hanDangKy = null
				item.save()
				Account.updateOne({idProfile: item._id}, {isDelete: 1}, (err, res) => {
					if(err) { console.log("==background: ", err )}
				})
			})
		}
	})

	Profile.find({isActive: false, hanDangKy: null, idPhong: null}, (err, val) => {
		if(err) { console.log("==background: ", err )}
		else {
			val.map((item, index) => {
				Account.findOne({idProfile: item._id}, async (err, res) => {
					if(err) { console.log('==background: ', err)}
					if(res) {
						var his = await History.findOne({idTaiKhoan: res._id}).catch(err => {
							console.log('==background: ',err)
						})
						if(!his) {
							Profile.deleteOne({ _id: item._id }, function (err) {
								if(err){
									console.log('==background: ', err)
								}
							})
							Account.deleteOne({idProfile: item._id}, function (err) {
								if(err) { console.log("==background: ", err )}
							})
						}
					}
				})
			})
		}
	})

	if(new Date().getDay() !== 1) {
		Profile.find({ ngayHetHan: {$lt: new Date()}}, (err, val) => {
			if(err) { console.log("==background: ", err )}
			else {
				val.map(async (item, index) => {
					item.isActive = false
					item.idPhong = null
					item.hanDangKy = null
					item.save()
					Account.updateOne({idProfile: item._id}, {isDelete: 1}, (err, res) => {
						if(err) { console.log("==background: ", err )}
					})
					var tmp = await Account.findOne({idProfile: item._id}, (err, res) => {
						if(err) { console.log("==background: ", err )}
					})
					if(tmp){
						History.find({ idTaiKhoan: tmp._id, ngayChuyen: { $ne: null}}).sort({
						    "ngayChuyen": -1
						}).then(result => {
							if(result.length > 0){
								History.updateOne({ _id: result[0]._id}, {ngayDi: new Date()}, (err, res) => {
									if(err) { console.log("==background: ", err )}
								})
							}
						})
					}
				})
			}
		})	
	}
}

