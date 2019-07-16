const LichSu = require('../models/LichSuRaVao')
require('../models/Profile')
require('../models/Truong')
require('../models/NganhHoc')
require('../models/Phong')
require('../models/TaiKhoan')

exports.find_history = (req, res) => {
  var {time, options, type} = req.body
  var fromDate = new Date(time.fromDate);
  fromDate.setHours(0,0,0,0);
  fromDate.setDate(fromDate.getDate() + 1);
  var toDate = new Date(time.toDate);
  toDate.setHours(0,0,0,0);
  toDate.setDate(toDate.getDate()+1);
  let query = {}
  if (fromDate.getDate() === toDate.getDate() 
  && fromDate.getMonth() === toDate.getMonth() 
  && fromDate.getFullYear() === toDate.getFullYear()){
    var newtoday = new Date(fromDate.setDate(fromDate.getDate()- 1))
    query = {
      $and: [{ thoiGian: {$lte: toDate }}, { thoiGian: {$gte: newtoday} }]
    }
  } else {
    query = {
      $and: [{ thoiGian: {$lte: toDate }}, { thoiGian: {$gte: fromDate} }]
    }
  }
  query.type = type === 'in-dormitory'?0:1;
  console.log(query);
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