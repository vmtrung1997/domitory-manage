var jwt = require('jsonwebtoken');
var rndToken = require('rand-token');
var moment = require('moment');
var jwt_decode = require('jwt-decode');


const dbToken = require('./refreshRepo');
const {SECRET, AC_LIFETIME} = require('../config.js')

exports.generateAccessToken = userEntity => {
    var payload = {
        user: userEntity,
        info: 'more info'
    }
    var token = jwt.sign(payload, SECRET, {
        expiresIn: AC_LIFETIME
    });
    return token;
}

exports.verifyAccessToken = (req, res, next) => {
    var token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, SECRET, (err, payload) => {
            if (err) {
                res.status(401).json({
                    msg: 'INVALID TOKEN',
                    error: err
                })
            } else {
                req.token_payload = payload;
                console.log('verify success');
                next();
            }
        });
    } else {
        res.status(403).json({
            msg: 'NO_TOKEN'
        })
    }
}

exports.generateRefreshToken = () => {
    const SIZE = 80;
    return rndToken.generate(SIZE);
}

exports.updateRefreshToken = (userId, rfToken) => {
    return new Promise((resolve, reject) => {
        var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
        dbToken.insertRefreshToken(rfToken, userId, rdt).then(result => {
            resolve(result);
        }).catch(err => reject(err));
    });
}

exports.verifyAdmin = (req, res, next) => {
    var token = req.headers['x-access-token'];
    if(token){
        const decode = jwt_decode(token)
        if(decode.user.userEntity.loai === 'SA' || decode.user.userEntity.loai === 'AM')
            next()
    }
}

exports.verifySecurity = (req, res, next) => {
    var token = req.headers['x-access-token'];
    if(token){
        const decode = jwt_decode(token)
        if(decode.user.userEntity.loai === 'SA' || decode.user.userEntity.loai === 'AM' || decode.user.userEntity.loai === 'BV')
            next()
    }
}