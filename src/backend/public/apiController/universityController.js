const Truong = require('../models/Truong')
const Nganh = require('../models/NganhHoc')
const TruongNganh = require('../models/TruongNganh')
const Profile =require('../models/Profile')
const TaiKhoan = require('../models/TaiKhoan')

exports.getSchoolList = (req, res) => {
  Truong.find().sort('tenTruong').then(value => {
    res.json({
      data: value
    })
  })
};

exports.insertSchool = (req, res) => {
  Truong.findOne({ tenTruong: { $regex: `.*${req.body.tenTruong}.*`, $options: 'i' } })
  .then(value => {
    if (value){
      res.json({
        rs: 'fail',
        msg: 'Tên trường đã tồn tại'
      })
    } else {
      var truong = new Truong({tenTruong: req.body.tenTruong});
      truong.save().then(() => {
        res.json({
          rs: 'success'
        })
      }).catch(err => {
        res.json({
          rs: 'fail',
          msg: err
        })
      })
    }
  })
};
exports.editSchool = (req, res) => {
  var school = req.body;
  Truong.updateOne({_id: school.id}, {
    $set: {tenTruong: school.tenTruong}
  }, (err, raw) => {
    if (err){
      res.json({
        rs: 'fail'
      })
    } else {
      res.json({
        rs: 'success'
      })
    }
  })
};

exports.removeSchool = (req, res) => {
  var {id} = req.body;
  TruongNganh.findOne({idTruong: id}).then(truongNganh => {
    if (truongNganh){
      res.json({
        rs: 'fail',
        msg: 'Không thể xóa trường chứa ngành'
      })
    } else {
      Profile.findOne({truong: id})
      .then(value => {
        if (value){
          res.json({
            rs: 'fail',
            msg: 'Không thể xóa trường chứa sinh viên'
          })
        } else {
          Truong.deleteOne({_id: id}, (err) => {
            if (err){
              res.json({
                rs: 'fail',
                msg: err
              })
            } else {
              res.json({
                rs: 'success',
              })
            }
          })
        }
      })
    }
  })
};

exports.getMajor = async (req, res) => {
  var id = req.body.id;
  const taiKhoan = await TaiKhoan.find({isDelete: 0,loai:"SV"}).select('_id');
  const arrTaiKhoan = taiKhoan.map(v => v._id);
  TruongNganh.find({idTruong: id}).populate('idNganhHoc').then(majorList => {
    const data = majorList.map(major => {
      return new Promise(async resolve => {
          Profile.countDocuments({idTaiKhoan: {$in: arrTaiKhoan}, nganhHoc: major.idNganhHoc._id}).then(count => {
            var mj = JSON.parse(JSON.stringify(major));
            mj.count = count
            resolve(mj)
          })
        })
    })
    Promise.all(data).then(result => {
      res.json({
        rs: 'success',
        data: result
      })
    })
    
  }).catch(err => res.json({rs: 'fail'}))
}

exports.insertMajor = (req, res) => {
  var nganh = new Nganh({
    tenNganh: req.body.tenNganh
  });
  nganh.save().then(nganhSave => {
    if (nganhSave){
      var truongNganh = new TruongNganh({
        idTruong: req.body.idTruong,
        idNganhHoc: nganhSave._id
      });
      truongNganh.save().then(truongNganh => {
        if (truongNganh){
          res.json({
            rs: 'success'
          })
        }
      })
    }
  })
};
exports.updateMajor = (req, res) => {
  Nganh.findOneAndUpdate({_id: req.body.id},
    {$set: {
      tenNganh: req.body.tenNganh
    }}, (err, doc) => {
      if (err){
        res.json({
          rs: 'fail',
          msg: err
        })
      } else {
        res.json({
          rs: 'success'
        })
      }
    })
};

exports.removeMajor = (req, res) => {
  Profile.findOne({nganhHoc: req.body.id})
  .then(value => {
    if (value){
      res.json({
        rs: 'fail',
        msg: 'Không thể xóa ngành chứa sinh viên'
      })
    } else {
      Nganh.deleteOne({_id: req.body.id}, (err) => {
        if (err){
          res.json({
            rs: 'fail',
            msg: err
          })
        } else {
          TruongNganh.deleteOne({idNganhHoc: req.body.id}, errTruongNganh => {
            if (errTruongNganh){
              res.json({
                rs: 'fail',
                msg: errTruongNganh
              })
            } else {
              res.json({
                rs: 'success'
              })
            }
          })
        }
      })
    }
  })
};