const Phong = require('../models/Phong');
const Truong = require('../models/Truong');

exports.get_room = () => {
  return new Promise((resolve, reject) => {
    Phong.
    find().
    sort({'tenPhong': 'asc'}).
    select(['_id', 'tenPhong', 'loaiPhong']).
    then(result => {
      if (result)
      resolve(result);
    }).catch(error => {
      console.log(error);
      reject(error);
    })
  })
};

exports.get_room_enable = (req, res) => {
  Phong.find({})
}

exports.get_element = (req, res) => {
  let obj = req.params.name;
  switch (obj) {
    case 'room':
      Phong.find().sort({'tenPhong': 'asc'}).select(['_id', 'tenPhong']).
      then(result => {
        res.status(200).json(result);
      }).catch(error => {
        res.status(400).json({err: error});
      });
      break;
    case 'school':
      Truong.find().sort({'tenTruong': 'asc'}).select(['_id', 'tenTruong']).
      then(result => {
        res.status(200).json(result);
      }).catch(error => {
        res.status(400).json({err: error});
      });
      break;
    case 'floor':
      Phong.distinct('lau').
        then(result => {
          res.status(200).json(result);

      }).catch(err => {
        res.status(400).json({err: err});
      })
      break;
  }
};