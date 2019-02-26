var express = require('express');
const ReToken = require('../models/refreshToken')
var router = express.Router();

router.get('/', (req, res) => {
	ReToken.findOneAndDelete({token: req.headers['x-refresh-token']}, function(err){
        if (err){
            console.log(err);
            res.status(400).json({
                status: 'fail',
                msg: err
            })
        } else {
            res.status(201).json({
                status: 'success',
                logout: true
            })
        }
    })
})

module.exports = router;