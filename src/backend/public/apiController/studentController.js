const Profile = require("../models/Profile");
const NganhHoc = require("../models/NganhHoc");
const Truong = require("../models/Truong");
const ChiPhiPhong = require("../models/ChiPhiPhong");
const HoatDong = require("../models/HoatDong");
const KetQuaHD = require("../models/KetQuaHD");
const User = require("../models/TaiKhoan");

require("../models/Phong");
require("../models/NganhHoc");
require("../models/Truong");
require("../models/HoatDong");

const moment = require("moment");

exports.a = (req, res) => {
  res.status(200).json({
    status: "success"
  });
};

exports.getSpecialized = (req, res) => {
  NganhHoc.find().then(result => {
    res.status(200).json({
      status: "success",
      data: result
    });
  });
};

exports.getListActivities = (req, res) => {
  var date = new Date();
  var skip = req.body.options.skip;
  var limit = req.body.options.limit;
  var totalPages = 1;

  KetQuaHD.find({ idSV: req.body.id })
    .select("idHD")
    .then(result => {
      var arr = [];
      result.forEach(item => {
        arr.push(item.idHD);
      });
      HoatDong.find({
        _id: { $nin: arr },
        ngayBD: {
          $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate())
        }
      }).countDocuments({}, (err, data) => {
        totalPages = parseInt(data) / limit;
      });
    });

  KetQuaHD.find({ idSV: req.body.id })
    .select("idHD")
    .skip(skip)
    .limit(limit)
    .then(result => {
      var arr = [];
      result.forEach(item => {
        arr.push(item.idHD);
      });
      HoatDong.find({
        _id: { $nin: arr },
        ngayBD: {
          $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate())
        }
      })
        .sort({ ngayBD: 1 })
        .skip(skip)
        .limit(limit)
        .then(rs => {
          if (!rs) {
            res.status(400).json({
              status: "fail",
              data: "no data"
            });
          } else {
            res.status(200).json({
              status: "success",
              data: rs,
              totalPages: totalPages
            });
          }
        });
    });
};

exports.cancelRegisterActivities = (req, res) => {
  req.body.data.activity.forEach(item => {
    try {
      KetQuaHD.deleteOne({ idHD: item.idHD, idSV: req.body.data.user })
        .then(() => {
          console.log("==delete: success");
          res.status(201).json({
            message: "ok"
          });
        })
        .catch(err => {
          console.log("==insert: ", err);
          res.status(500);
        });
    } catch (e) {
      console.log(e);
    }
  });
};

exports.registerActivities = (req, res) => {
  req.body.data.activity.forEach(item => {
    try {
      var data = {
        idHD: item,
        idSV: req.body.data.user,
        isDK: true,
        isTG: false
      };
      var register = new KetQuaHD(data);
      register
        .save()
        .then(() => {
          console.log("==insert: success");
          res.status(201).json({
            message: "ok"
          });
        })
        .catch(err => {
          console.log("==insert: ", err);
          res.status(500);
        });
    } catch (e) {
      console.log(e);
    }
  });
};

exports.changePassword = (req, res) => {
  console.log(req.body);
  User.findOne({
    username: req.body.username,
    password: req.body.oldPassword
  }).then(user => {
    if (user) {
      User.updateOne(
        {
          username: req.body.username,
          password: req.body.oldPassword,
          isDelete: 0
        },
        {
          $set: {
            password: req.body.newPassword
          }
        },
        function(err, place) {
          console.log(err);
          if (err) {
            res.status(400).json({
              err: err
            });
          } else {
            res.status(200).json({
              rs: "success",
              data: place
            });
          }
        }
      );
    } else {
      res.json({
        rs: "fail",
        msg: "Invalid password"
      });
    }
  });
};

exports.updateInfo = (req, res) => {
  Profile.findOneAndUpdate(
    { idTaiKhoan: req.body.data.idTaiKhoan },
    {
      MSSV: req.body.data.MSSV,
      danToc: req.body.data.danToc,
      diaChi: req.body.data.diaChi,
      email: req.body.data.email,
      gioiTinh: req.body.data.gioiTinh,
      hoTen: req.body.data.hoTen,
      idPhong: req.body.data.idPhong,
      nganhHoc: req.body.data.nganhHoc,
      ngayHetHan: req.body.data.ngayHetHan,
      ngaySinh: req.body.data.ngaySinh,
      ngayVaoO: req.body.data.ngayVaoO,
      sdt: req.body.data.sdt,
      sdtNguoiThan: req.body.data.sdtNguoiThan,
      truong: req.body.data.truong
    },
    function(err, place) {
      if (err) {
        res.status(400).json({
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
};

exports.getBill = (req, res) => {
  var skip = req.body.options.skip + 1; //không lấy tháng gần nhất
  var limit = req.body.options.limit;
  var totalPages = 1;

  ChiPhiPhong.countDocuments(
    { idPhong: req.body.id },
    (err, data) => {
      totalPages = parseInt(data) / limit;
    }
  );
  //console.log(req.body.id);
  ChiPhiPhong.find({ idPhong: req.body.id })
	.sort({ nam: -1, thang: -1 })
	.skip(skip)
    .limit(limit)
    .then(result => {
      if (result) {
        res.status(200).json({
          status: "success",
		  data: result,
		  totalPages: totalPages
        });
      } else {
        res.status(400).json({
          status: "fail",
          data: "no data"
        });
      }
    });
};


exports.getLastBill = (req, res) => {

  
	ChiPhiPhong.findOne({ idPhong: req.body.id })
	  .sort({ nam: -1, thang: -1 })
	  .then(result => {
		if (result) {
		  res.status(200).json({
			status: "success",
			data: result,
		  });
		} else {
		  res.status(400).json({
			status: "fail",
			data: "no data"
		  });
		}
	  });
  };

  
exports.getSchool = (req, res) => {
  Truong.find().then(result => {
    res.status(200).json({
      status: "success",
      data: result
    });
  });
};

exports.upcomingActivities = (req, res) => {
  var skip = req.body.options.skip;
  var limit = req.body.options.limit;
  var totalPages = 1;
  KetQuaHD.countDocuments({ idSV: req.body.id }, (err, data) => {
    totalPages = parseInt(data) / limit;
  });

  KetQuaHD.find({ idSV: req.body.id })
    .populate({ path: "idHD" })
    .skip(skip)
    .limit(limit)
    .then(result => {
      if (result) {
        res.status(200).json({
          status: "success",
          data: result,
          totalPages: totalPages
        });
      } else {
        res.json({
          status: "fail",
          data: "no data"
        });
      }
    });
};

exports.getInfo = (req, res) => {
  var id = req.body.id;

  Profile.findOne({ idTaiKhoan: id })
    .populate([
      { path: "truong", select: "tenTruong" },
      { path: "nganhHoc", select: "tenNganh" },
      { path: "idPhong", select: "tenPhong lau" }
    ])
    .then(result => {
      if (result) {
        res.status(200).json({
          status: "success",
          data: result
        });
      } else {
        res.json({
          status: "fail",
          data: "no data"
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getInfoByIdCard = (req, res) => {
  var idCard = req.body.idCard;

  Profile.findOne({ maThe: idCard })
    .then(result => {
      if (result) {
        res.status(200).json({
          status: "success",
          student: result
        });
      } else {
        res.json({
          status: "fail",
          data: "no data"
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};
