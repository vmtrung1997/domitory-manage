// const ObjectId = require('mongoose').mongo.ObjectId;
// const md5 = require('md5');


require('../models/TaiKhoan');
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
  arrDel.forEach(id => {

  })
}

exports.getListStudent = (req, res) => {
  let query = {};
  const params = req.body;
  if(params.hoTen)
    query.hoTen = params.hoTen;
  if(params.mssv)
    query.MSSV = params.mssv;
  if(params.idPhong)
    query.idPhong = params.idPhong;
  if(!params.options)
    res.status(400).json({'msg': 'missing options'});
  //query.idTaiKhoan = {$ne: null} ;
  //query.idTaiKhoan =  {isDelete: 0};
  console.log('==query', query);

  let options = params.options;
  options.populate = ['idTaiKhoan','idPhong', 'truong', 'nganhHoc'];
  //options.populate = [ 'idTaiKhoan', 'idPhong' ];
  console.log('==query', query);
  Account.find({isDelete: 0}).select('_id').then(accs => {
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

