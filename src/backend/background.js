const Profile = require('./public/models/Profile');
const Account = require('./public/models/TaiKhoan');
const History = require('./public/models/LichSuPhong')

exports.background = () => {
	var query = {
		isActive: false,
	    hanDangKy: { 
	        "$lt": new Date()
	    }
	}
	
	Profile.find(query, (err, val) => {
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

