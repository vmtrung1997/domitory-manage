const ObjectId = require("mongoose").mongo.ObjectId;
const md5 = require("md5");
const User = require("../models/TaiKhoan");
const Profile = require("../models/Profile");
const ReToken = require("../models/refreshToken");
const auth = require("../repos/authRepo");
const nodemailer = require("nodemailer");
require("../models/PhanQuyen")
const smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "ktx135btranhungdao@gmail.com",
    pass: "ktxtranhungdao"
  }
});

exports.register = (req, res) => {
  var userObject = req.body;
  userObject.password = md5(userObject.password);
  var user = new User({...userObject, isDelete:0});
  user
    .save()
    .then(userObj => {
      var profile = new Profile({
        idTaiKhoan: userObj._id,
        hoTen: userObject.hoTen,
        gioiTinh: 1 
      })
      profile.save().then(() => {
        console.log("==register: success");
        res.status(201).json(req.body);
      })
    })
    .catch(err => {
      console.log("==register: ", err);
      res.status(500);
    });
};

exports.login = (req, res) => {
  User.findOne(
    { username: req.body.username, password: req.body.password, isDelete: 0 }
  ).populate({path: "phanQuyen", select: "quyen"}).then(function(result) {
    if (result) {
      var userEntity = result;
      Profile.findOne({ idTaiKhoan: userEntity._id }, (err, prof) => {
        var userObj = { userEntity, profile: prof };
        var acToken = auth.generateAccessToken(userObj);
        var reToken = auth.generateRefreshToken();
        auth
          .updateRefreshToken(result._id, reToken)
          .then(() => {
            console.log("==login: success");
            res.status(200).json({
              status: "success",
              access_token: acToken,
              refresh_token: reToken
            });
          })
          .catch(err => {
            res.status(500).json({
              status: "server fail",
              msg: err
            });
          });
      });
    } else {
      res.status(400).json({
        status: "login fail",
        auth: false
      });
    }
  });
};

exports.resetPassword = (req, res) => {
  Profile.findOne({ MSSV: req.body.mssv, CMND: req.body.cmnd })
    .then(result => {
      if (result) {
        var pass = Math.floor(Math.random() * 100000).toString();
        var md5Pass = md5(pass);
        console.log(pass,md5Pass);
        User.findOneAndUpdate(
          { _id: result.idTaiKhoan },
          {
            $set:{
              password: md5Pass
            }
          },
          function(err, place) {
            if (err) {
              res.status(400).json({
                res: "fail",
                err: err
              });
            } else {
              res.status(201).json({
                res: "success",
                data: place
              });
            }
          }
        );
        
        let mailOptions = {
          from: ' "KTX Trần Hưng Đạo" <ktx135btranhungdao@gmail.com>',
          to: "tainguyen197.ntt@gmail.com",
          subject: "Mật khẩu của bạn đã được thay đổi",
          html:
            "Chào " +
            result.hoTen +
            " , <br> Đây là mật khẩu mới của bạn: <strong>" +
            pass +
            "</strong>"
        };
        smtpTransport.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          } else {
            console.log("------");
            res.json({
              rs: "success"
            });
          }
        });
      } else {
        res.json({
          res: "fail",
          data: "no data"
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.resetPasswordAdmin = (req, res) => {
  const email = req.body.email
  const username = req.body.username
  var msg = ''
  User.findOne({username: username})
  .populate('idProfile')
  .then( result => {
    if(result && result.idProfile){
      if(result.isDelete === 1){
        res.status(401).json({
          msg: "Tài khoản đã bị xóa!"          
        })
      } else if( !result.idProfile.email ){
        res.status(401).json({
          msg: "Tài khoản không tồn tại email xác thực!"
        })
      } else if( result.idProfile.email !== email){
        res.status(401).json({
          msg: 'Email không khớp với tài khoản'
        })
      } else {
        var pass = Math.floor(Math.random() * 100000).toString();
        var md5Pass = md5(pass)
        result.password = md5Pass
        result.save()
        let mailOptions = {
          from: ' "KTX Trần Hưng Đạo" <ktx135btranhungdao@gmail.com>',
          to: result.idProfile.email,
          subject: "Mật khẩu của bạn đã được thay đổi",
          html:
            "Chào " +
            result.idProfile.hoTen +
            " , <br> Đây là mật khẩu mới của bạn: <strong>" +
            pass +
            "</strong>"
        };
        res.status(200).json({
          msg: 'success'
        })
        smtpTransport.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('--sendEmailChangePass: ', error)
            res.status(500).json({
              msg: 'Hệ thống không gửi được email'
            })
          } else {
            console.log('--sendEmailChangePass: success')
          }
        });
      }
    } else {  
      res.status(401).json({
        msg: "Không tìm thấy tên tài khoản tương ứng!",
      })
    }
  
  }) 
  .catch( err => {
    console.log('--resetPasswordAdmin:', err)
    res.status(500).json({
      msg: 'Lỗi server'
    });
  })
  
};

exports.me_access = (req, res) => {
  var reToken = req.headers["x-refresh-token"];
  ReToken.findOne({ token: reToken }, null, function(err, result) {
    if (err) {
      res.status(401).end("end");
      console.log("==refresh_token: ", err);
    }

    if (result) {
      var id = new ObjectId(result.userid);
      User.findOne({ _id: id })
      .populate({path: 'phanQuyen', select: 'quyen'})
      .then(function(userEntity) {
        if (userEntity) {
          Profile.findOne({ idTaiKhoan: userEntity._id }, (err, prof) => {
            if (prof) {
              var userObj = { userEntity, profile: prof };
              var acToken = auth.generateAccessToken(userObj);
              console.log("==refresh_token: success");
              res.status(200).json({
                auth: true,
                access_token: acToken,
                refresh_token: reToken
              });
            }
            if (err) {
              res.status(401).end("end");
              console.log("==refresh_token: ", err);
            }
          });
        } else {
          res.status(400).end();
        }
      })
    } else {
      res.status(401).end("end");
    }
  });
};
