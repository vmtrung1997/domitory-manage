// const ObjectId = require('mongoose').mongo.ObjectId;
// const md5 = require('md5');


require('../models/TaiKhoan');
//require('../models/NganhHoc');
const Student = require('../models/Profile');
const ReToken = require('../models/refreshToken');
let auth = require('../repos/authRepo');

function getNumberPage(limit){
  return new Promise((resolve, reject) => {
    Student.count().then(result => {
      console.log('==end page', result/limit);
      const num = result/limit;
      resolve (num);
    }).catch(err => reject(err));
  })

}

exports.getListStudent = (req, res) => {
  const mssv = req.body.mssv;
  const ten = req.body.ten;
  const phong = req.body.phong;
  var options = req.body.options;
  options.populate = ['idTaiKhoan'];
  Student.paginate({}, options)
    .then(result => {
      res.status(200).json(result);
    }).catch(err => {
    console.log('==fail', err);
    res.status(400).json({
      err: 'fail'
    })
  })
  //}
};