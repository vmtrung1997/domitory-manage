const ObjectId = require("mongoose").mongo.ObjectId;
const md5 = require("md5");
const TaiKhoan = require("../models/TaiKhoan");
const User = require("../models/TaiKhoan");
const Profile = require("../models/Profile");
const ReToken = require("../models/refreshToken");
var auth = require("../repos/authRepo");
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport({
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
  var user = new User(userObject);
  user
    .save()
    .then(() => {
      console.log("==register: success");
      res.status(201).json(req.body);
    })
    .catch(err => {
      console.log("==register: ", err);
      res.status(500);
    });
};

exports.login = (req, res) => {
  User.findOne(
    { username: req.body.username, password: req.body.password, isDelete: 0 },
    function(error, result) {
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
                status: "fail",
                msg: err
              });
            });
        });
      } else {
        res.status(401).json({
          status: "fail",
          auth: false
        });
      }
    }
  );
};

exports.resetPassword = (req, res) => {
  console.log(req.body);
  Profile.findOne({ MSSV: req.body.mssv, CMND: req.body.cmnd })
    .then(result => {
      if (result) {
        var pass = Math.floor(Math.random() * 100000).toString();
        var md5Pass = md5(pass);
        console.log(pass,md5Pass);
        TaiKhoan.findOneAndUpdate(
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
        // console.log(result.idTaiKhoan);
        //
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

exports.me_access = (req, res) => {
  var reToken = req.headers["x-refresh-token"];
  ReToken.findOne({ token: reToken }, null, function(err, result) {
    if (err) {
      res.status(401).end("end");
      console.log("==refresh_token: ", err);
    }

    if (result) {
      var id = new ObjectId(result.userid);
      User.findOne({ _id: id }, function(err, userEntity) {
        if (err) {
          res.status(401).end("end");
          console.log("==refresh_token: ", err);
        }
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
        }
      });
    } else {
      res.status(401).end("end");
    }
  });
};
