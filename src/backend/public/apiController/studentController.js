const Profile = require("../models/Profile");
const NganhHoc = require("../models/NganhHoc");
const Truong = require("../models/Truong");
const ChiPhiPhong = require("../models/ChiPhiPhong");
const HoatDong = require("../models/HoatDong");
const KetQuaHD = require("../models/KetQuaHD");
const Phong = require("../models/Phong");
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
  console.log("aaaaaa");
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

exports.updateFisrtInfo = (req, res) => {
  console.log(req.body.data);
  Profile.updateOne(
    { _id: req.body.data.id },
    {
      $set: {
        danToc: req.body.data.danToc,
        CMND: req.body.data.CMND,
        diaChi: req.body.data.diaChi,
        email: req.body.data.email,
        gioiTinh: req.body.data.gioiTinh,
        //hoTen: req.body.data.hoTen,
        tonGiao: req.body.data.tonGiao,
        //idPhong: req.body.data.idPhong,
        nganhHoc: req.body.data.nganhHoc,
        // ngayHetHan: req.body.data.ngayHetHan,
        ngaySinh: req.body.data.ngaySinh,
        // ngayVaoO: req.body.data.ngayVaoO,
        sdt: req.body.data.sdt,
        sdtNguoiThan: req.body.data.sdtNguoiThan,
        truong: req.body.data.truong,
        flag: req.body.data.flag
      }
    },
    function(err, place) {
      if (err) {
        res.status(400).json({
          err: err
        });
      } else {
        res.status(202).json({
          res: "success",
          data: place
        });
      }
    }
  );

  // Profile.findOneAndUpdate(
  //   { _id:  },
  //   {
  //     danToc: req.body.data.danToc,
  //     CMND: req.body.data.CMND,
  //     diaChi: req.body.data.diaChi,
  //     email: req.body.data.email,
  //     gioiTinh: req.body.data.gioiTinh,
  //     //hoTen: req.body.data.hoTen,
  //     tonGiao: req.body.data.tonGiao,
  //     //idPhong: req.body.data.idPhong,
  //     nganhHoc: req.body.data.nganhHoc,
  //     // ngayHetHan: req.body.data.ngayHetHan,
  //     ngaySinh: req.body.data.ngaySinh,
  //     // ngayVaoO: req.body.data.ngayVaoO,
  //     sdt: req.body.data.sdt,
  //     sdtNguoiThan: req.body.data.sdtNguoiThan,
  //     truong: req.body.data.truong,
  //     flag: req.body.data.flag
  //   },
  //   function(err, place) {
  //     if (err) {
  //       res.status(400).json({
  //         err: err
  //       });
  //     } else {
  //       res.status(202).json({
  //         res: "success",
  //         data: place
  //       });
  //     }
  //   }
  // );
};

exports.getBill = (req, res) => {
  var skip = req.body.options.skip + 1; //không lấy tháng gần nhất
  var limit = req.body.options.limit;
  var totalPages = 1;

  ChiPhiPhong.countDocuments({ idPhong: req.body.id }, (err, data) => {
    totalPages = parseInt(data) / limit;
  });
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
          data: result
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

  console.log(req.body.id,'------------');
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

//-----------------Room--------------------
exports.getRoom = (req, res) => {
  Phong.find({ lau: req.body.room })
    .populate({
      path: "loaiPhong",
      match: { loai: { $in: [0, 1], $exists: true } },
      select: "loai ten" // Phòng sinh viên và dịch vụ
    })
    .sort({ tenPhong: 1 })
    .then(rs => {
      if (rs) {
        res.status(200).json({
          data: rs
        });
      } else {
        res.status(204).json({
          data: "no data"
        });
      }
    });
};

//------------update Room
exports.updateRoom = (req, res) => {
  try {
    Phong.find({ _id: req.body.idPhong }).then(rs => {
      if (rs.length > 0) {
        if (rs[0].soNguoi < rs[0].soNguoiToiDa) {
          try {
            Profile.findOneAndUpdate(
              { _id: req.body.id },
              { idPhong: req.body.idPhong }
            ).then(rs => {
              console.log(rs);
              if (rs) {
                res.status(202).json({
                  data: rs
                });
              } else {
                res.status(204).json({
                  data: "no data"
                });
              }
            });
          } catch (e) {
            console.log(e);
          }
        } else {
          res.status(204).json({
            data: "no data"
          });
        }
      } else {
        res.status(204).json({
          data: "no data"
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

//----Get danh sách Profile in Phong
exports.getProfileByIdPhong = (res, req) => {
  Profile.find({ idPhong: res.body.id }).then(rs => {
    if (rs.length > 0) {
      req.status(200).json({
        data: rs
      });
    } else {
      req.status(204).json({
        data: rs
      });
    }
  });
};

//------------- Get điểm rèn luyện
exports.getPoint = (req, res) => {
  var result = [];
  var ngayVaoO = new Date(req.body.ngayVaoO);
  if (ngayVaoO === undefined) {
    res.status(204).json({
      data: "no data"
    });
  }
  KetQuaHD.find({ idSV: req.body.id })
    .populate({
      path: "idHD",
      match: {
        ngayBD: { $gte: ngayVaoO }
      },
      select: "diem batBuoc ten diaDiem ngayBD ngayKT thang nam"
    })
    .then(rs => {
      //console.log(rs);
      var year = ngayVaoO.getFullYear();
      var now = new Date();
      for (var yearpoint = year; yearpoint <= now.getFullYear(); yearpoint++) {
        var point = 0;
        rs.every((item,index) => {
            //console.log(item.idHD.ngayKT.getMonth() + 1);
          //Sắp xếp điểm từ tháng 8 -> tháng 7 năm sau
          //console.log(item)

          if (
            (item.idHD.ngayKT.getMonth() + 1 > 7 &&
              item.idHD.ngayKT.getFullYear() > yearpoint + 1) ||
            (item.idHD.ngayKT.getMonth() + 1 < 8 &&
              item.idHD.ngayKT.getFullYear() === yearpoint) ||
            (item.idHD.ngayKT.getFullYear() < yearpoint ||
              item.idHD.ngayKT.getFullYear() > yearpoint + 1)
          ) {
            //console.log('----------');
            //console.log( item.idHD.ngayKT.getFullYear(),item.idHD.ngayKT.getMonth() + 1, yearpoint)
            return false;
          }
          //console.log(yearpoint);
          if (item.idHD.batBuoc && !item.isTG) {
            point -= item.idHD.diem;
          } else if (item.isTG) {
            point += item.idHD.diem;
          }
        });

        var temp = {
          year: yearpoint,
          point: point
        };

        result.push(temp);
      }
      //console.log(result);
    });
};
