const LichSu = require('../models/LichSu')
const mongoose = require('mongoose')
const Profile = require('../models/Profile')
require('../models/Profile')
require('../models/Truong')
require('../models/NganhHoc')
require('../models/Phong')
require('../models/TaiKhoan')

exports.find_history = (req, res) => {
  console.log(req.body)
  var {time, options} = req.body
  var fromDate = new Date(time.fromDate);
  console.log(fromDate);
  LichSu.paginate(
    {
      $and: [{ thoiGian: {$lte:new Date(time.toDate)} }, { thoiGian:{ $gte:new Date( time.fromDate)} }] 
    },
    {
      populate: {
        path: 'profile',
        select: 'hoTen idPhong truong nganhHoc img',
        populate: [{ path: 'idPhong', select: 'tenPhong' },
        { path: 'truong', select: 'tenTruong' },
        { path: 'nganhHoc', select: 'tenNganh' }],
      },
      sort: '-thoiGian',
      page: options.page,
      limit: options.limit
    }).then(value => {
      res.json({
        rs: 'success',
        data: value
      })
    }).catch(err => {
      res.json({
        rs: 'fail',
        msg: err
      })
    })
}