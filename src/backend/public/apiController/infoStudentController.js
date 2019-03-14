// const ObjectId = require('mongoose').mongo.ObjectId;
// const md5 = require('md5');


require('../models/TaiKhoan');
//require('../models/NganhHoc');
const Profile = require('../models/Profile');
const ReToken = require('../models/refreshToken');
let auth = require('../repos/authRepo');

// function getNumberPage(limit){
//   return new Promise((resolve, reject) => {
//     Student.count().then(result => {
//       console.log('==end page', result/limit);
//       const num = result/limit;
//       resolve (num);
//     }).catch(err => reject(err));
//   })
//
// }

exports.getListStudent = (req, res) => {
  let query = {};
  const params = req.body;
  if(params.MSSV)
    query.MSSV = params.MSSV;
  if(params.hoTen)
    query.hoTen = params.hoTen;
  if(params.idPhong)
    query.idPhong = params.idPhong;
  if(!params.options)
    res.status(400).json({'msg': 'missing options'});

  let options = params.options;
  options.populate = [ 'idTaiKhoan', 'idPhong' ];
  console.log('==query', query);
  Profile.paginate(query, options)
    .then(result => {
      res.status(200).json(result);
    }).catch(err => {
    console.log('==fail', err);
    res.status(400).json({
      err: 'get info student fail'
    })
  })
  //}
};