const LichSu = require('../models/LichSu')
const Profile = require('../models/Profile')
const TaiKhoan = require('../models/TaiKhoan')
require('../models/Profile')
require('../models/Truong')
require('../models/NganhHoc')
require('../models/Phong')
require('../models/TaiKhoan')
function find_history(){
  return new Promise(async (resolve,reject) => {
    // var list = []
    // await TaiKhoan.find({isDelete: 0}).populate([{path: 'idProfile', select: 'MSSV'}]).then(result => {
    //     result.forEach(r => {
    //       list.push(r.idProfile.MSSV);
    //     });
    // })
    // console.log(list);
    LichSu.find().sort({thoiGian: -1}).
    limit(15).
    populate({
      path: 'profile',
      select: 'hoTen idPhong truong nganhHoc img',
      populate: [{ path: 'idPhong', select: 'tenPhong'}]
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
  find_history().then(result => {
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
  var {info} = req.body;
  Profile.findOne({maThe: info}).populate([
  { path:'idTaiKhoan', match:{ isDelete: 0}},
  { path: 'idPhong', select: 'tenPhong'}, 
]).then(profile => {
      if (profile && profile.idTaiKhoan!=null){
        console.log(profile)
        if (profile.MSSV)
        var his = new LichSu({
          MSSV: profile.MSSV,
          thoiGian: new Date()
        })
        his.save().then(value => {
          // find_history().then(result => {
          //   res.json({
          //     rs: 'success',
          //     hisList: result
          //   })
          // }).catch(errFind => {
          //   res.json({
          //     rs: 'fail',
          //     msg: errFind
          //   })
          // })
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
        console.log('notfound');
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