const ReToken = require('../models/refreshToken')

exports.logout = (req, res) => {
	ReToken.findOneAndDelete({ token: req.headers['x-refresh-token'] }, function (err) {
		if (err) {
			console.log('==logout', err);
			res.status(400).json({
				status: 'fail',
				msg: err
			})
		} else {
			console.log('==logout: success')
			res.status(201).json({
				status: 'success',
				logout: true
			})
		}
	})
}