const LichSu = require('../models/LichSu')
const mongoose = require('mongoose')
const Profile = require('../models/Profile')
require('../models/Profile')
require('../models/Truong')
require('../models/NganhHoc')
require('../models/Phong')
require('../models/TaiKhoan')

exports.find_history = (req, res) => {
  var {time, options} = req.body
  var fromDate = new Date(time.fromDate);
  var toDate = new Date(time.toDate);
  let query = {}
  if (fromDate.getDate() === toDate.getDate() 
  && fromDate.getMonth() === toDate.getMonth() 
  && fromDate.getFullYear() === toDate.getFullYear()){
    query = {thoiGian: {$gte: fromDate}}
  } else {
    query = {
      $and: [{ thoiGian: {$lte: toDate }}, { thoiGian: {$gte: fromDate} }]
    }
  }
  console.log(query)
  LichSu.paginate(query,
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