var router = require('express').Router();
const ObjectId = require('mongoose').mongo.ObjectId;

const User = require('../models/TaiKhoan');
const Profile = require('../models/Profile')
const ReToken = require('../models/refreshToken');
var auth = require('../repos/authRepo');

router.get('/', (req, res) => {
	var reToken = req.headers['x-refresh-token'];
	ReToken.findOne({ token: reToken }, null, function (err, result) {
		if (err) {
			res.status(401).end('end')
			console.log('==refresh_token: ',err);
		}

		if (result) {
			var id = new ObjectId(result.userid);
			User.findOne({ '_id': id }, function (err, userEntity) {
				if( err ) {
					res.status(401).end('end')
					console.log('==refresh_token: ',err);
				}
				if (userEntity) {
					Profile.findOne({idTaiKhoan: userEntity._id},(err,prof) => {
						if( prof ){
							var userObj = {userEntity, profile: prof}
							var acToken = auth.generateAccessToken(userObj);
							console.log('==refresh_token: success')
							res.status(200).json({
								auth: true,
								access_token: acToken,
								refresh_token: reToken
							})
						}
						if( err ){
							res.status(401).end('end')
							console.log('==refresh_token: ',err);
						}
					})
				}
			})
		} else {
			res.status(401).end('end')
		}
	})
});
 
module.exports = router;
