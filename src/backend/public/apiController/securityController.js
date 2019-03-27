const LichSu = require('../models/LichSu')
require('../models/Profile')
exports.get_history_list = (req, res) => {
  LichSu.aggregate([
    {
      $lookup:{
      from: 'Profile',
      localField: 'MSSV',
      foreignField: 'MSSV',
      as: 'profile'
      }
    },
    {
      $match:{ profile: {$ne: {}} } 
    },
    {
      $sort: {thoiGian: -1}
    },
    {
      $limit: 15
    }
  ]).
  then(hisList => {
    res.json({
      rs:'success',
      data: hisList
    })
  }).catch(err => {
    res.json({
      rs: 'fail',
      msg: err
    })
  })
}