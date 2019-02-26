const Token = require('../models/refreshToken')

exports.deleteRefreshToken = (user) => {
    return new Promise((resolve, reject) =>{
        Token.deleteOne({userid: user}).then(res =>{
            resolve(res)
        }).catch(err=>{
            reject(err);
        })
    });
}
exports.insertRefreshToken = (reToken, user, time) => {
    return new Promise((resolve, reject) => {
        var token = new Token({
            userid: user,
            token: reToken,
            exp: time
        });
        token.save().then(result=>{
            resolve(result);
        }).catch(err => {
            reject(err);
        })
    })
}