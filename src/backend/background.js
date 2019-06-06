const Profile = require('./public/models/Profile');
const Account = require('./public/models/TaiKhoan');

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
				val.map((item, index) => {
					item.isActive = false
					item.save()
					console.log(item)
					Account.updateOne({idProfile: item._id}, {isDelete: 1}, (err, res) => {
						if(err) { console.log("==background: ", err )}
					})
				})
			}
		})	
	}
}

