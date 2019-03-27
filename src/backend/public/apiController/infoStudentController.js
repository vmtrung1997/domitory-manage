// const ObjectId = require('mongoose').mongo.ObjectId;
// const md5 = require('md5');


require('../models/TaiKhoan');
var multer  = require('multer'),
    upload = multer().any();
//require('../models/NganhHoc');
const Profile = require('../models/Profile');
const Account = require('../models/TaiKhoan');
const ReToken = require('../models/refreshToken');
let auth = require('../repos/authRepo');
const md5 = require('md5');

exports.addStudent = (req, res) => {
  console.log('==111')
  let accStudent = {
    username: req.body.mssv,
    password: md5(req.body.mssv),
    loai: "SV",
    isDelete: 0
  }
  var acc = new Account(accStudent);
  console.log('==2222')

  acc.save().then((result) => {
    console.log('==register: success', result)
    let infoStudent = {
      idTaiKhoan: result._id,
      hoTen: req.body.hoTen,
      MSSV: req.body.mssv,
      idPhong: req.body.idPhong,
      truong: req.body.idTruong,
    }
    let student = new Profile(infoStudent);
    student.save().then(result => {
      console.log('==register student: success', result);
      res.status(200).json(req.body);
    }).catch(err => {
      console.log('==register stu err: ', err);
      res.status(500);
    })
  }).catch(err => {
    console.log('==register err: ', err);
    res.status(500);
  })
}

exports.deleteStudent = (req, res) => {
  const arrDel = req.body.arrDelete;
  console.log('==body', req.body, arrDel);
  if(arrDel === undefined || arrDel.length == 0) {
    console.log('==rỗng')
    res.status(400).json({msg: 'Không có dữ liệu để xóa'})
  }
  else {
    arrDel.forEach(id => {
      console.log('==id', id);
      Account.findOneAndUpdate({username: id},{ $set: {isDelete: 1} })
        .then(result => {
          console.log('find success', result);
          res.status(200).json({msg: 'Bạn đã xóa thành công'})
        }).catch(err => {
        res.status(400).json({msg: 'Xóa thất bại'})
      })
    })
  }

}

exports.updateInfo = (req,res) => {
  const info = req.body.info;
  Profile.findOneAndUpdate({MSSV: info.MSSV},{ $set: info })
    .then(result => {
      console.log('==success', result)
      res.status(200).json({msg: 'Cập nhật thành công!'})
    }).catch(err => {
    console.log('==err', err)
      res.status(400).json({msg: 'cập nhật không thành công!'})
  })
};

exports.importFile = (req, res, err) => {

  upload(req, res, function (err) {
    console.log("Request ---", req.body);
    console.log("Request file ---", req.files);//Here you get file.
    /*Now do where ever you want to do*/
    if(!err)
      return res.send(200).end();
  })
  //return res.status(200).json({msg: 'import success'})

};

exports.getListStudent = (req, res) => {
  let query = {};
  const params = req.body;
  if(params.hoTen)
    query.hoTen = { $regex: '.*' + params.hoTen + '.*', $options: 'i' };
  if(params.mssv)
    query.MSSV = { $regex: '.*' + params.mssv + '.*', $options: 'i' };

  if(params.idPhong)
    query.idPhong = params.idPhong;
  if(params.idTruong)
    query.truong = params.idTruong;
  if(!params.options)
    res.status(400).json({'msg': 'missing options'});
  //query = {...query, truong:{$nin: [null, '']}};
  //query.idTaiKhoan =  {isDelete: 0};
  console.log('==query', query);

  let options = params.options;
  options.populate = ['idTaiKhoan','idPhong', 'truong', 'nganhHoc'];

  console.log('==query', query);
  Account.find({isDelete: 0, loai: 'SV'}).select('_id').then(accs => {
    var arr = [];
    accs.forEach(acc => {
      arr.push(acc._id)
    })
    query.idTaiKhoan = {$in : arr}
    Profile.paginate(query, options)
      .then(result => {
        res.status(200).json(result);
      }).catch(err => {
      console.log('==fail', err);

      res.statusCode(400).json({
        err: 'get info student fail'
      })
    })
  })

  //}
};

