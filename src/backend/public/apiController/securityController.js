const LichSu = require('../models/LichSuRaVao')
const Profile = require('../models/Profile')
require('../models/Profile')
require('../models/Truong')
require('../models/NganhHoc')
require('../models/Phong')
require('../models/TaiKhoan')
function find_history(type){
  return new Promise(async (resolve,reject) => {
    LichSu.find(type).sort({thoiGian: -1}).
    limit(15).
    populate({
      path: 'profile',
      select: 'hoTen idPhong truong nganhHoc img',
      populate: [
        { path: 'idPhong', select: 'tenPhong'}, 
        {path: 'truong', select: 'tenTruong'},
        {path: 'nganhHoc', select: 'tenNganh'}
        ]
    }).
    exec((err,result) => {
      if (result){
        resolve(result)
      } else {
        reject(err)
      }
    })
  })
}

exports.get_history_list = (req, res) => {
  var {type} = req.body
  find_history({type: type=='in-dormitory'?0:1}).then(result => {
    res.json({
      rs: 'success',
      data: result
    })
  }).catch(err => {
    res.json({
      rs: 'fail',
      msg: err
    })
  })
}

exports.input_card = (req, res) => {
  var {info, type} = req.body;
  Profile.findOne({maThe: info}).populate([
  { path:'idTaiKhoan', match:{ isDelete: 0}},
  { path: 'idPhong', select: 'tenPhong'},
  {path: 'truong', select: 'tenTruong'},
  {path: 'nganhHoc', select: 'tenNganh'}
]).then(profile => {
      if (profile && profile.idTaiKhoan!=null){
        if (profile.MSSV)
        var his = new LichSu({
          MSSV: profile.MSSV,
          thoiGian: new Date(),
          type: type=='in-dormitory'?0:1
        })
        his.save().then(value => {
          res.json({
            rs:'success',
            data: {
              _id: value._id,
              MSSV: value.MSSV,
              thoiGian: value.thoiGian,
              profile: profile
            }
          })
        }).catch(errSave => {
          res.json({
            rs: 'fail',
            msg: errSave
          })
        })
      } else {
        res.json({
          rs: 'not found',
          msg: 'Thẻ đã xóa'
        })
      }
  }).catch(err => {
    res.json({
      rs: 'fail',
      msg: err
    })
  })
}