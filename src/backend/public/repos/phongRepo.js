const Phong = require('../models/Phong');
const Truong = require('../models/Truong');

exports.get_room = () => {
  return new Promise((resolve, reject) => {
    Phong.
    find().
    sort({'tenPhong': 'asc'}).
    select(['_id', 'tenPhong']).
    then(result => {
      if (result)
      resolve(result);
    }).catch(error => {
      console.log(error);
      reject(error);
    })
  })
};

exports.get_element = (req, res) => {
  let obj = req.params.name;
  switch (obj) {
    case 'phong':
      Phong.find().sort({'tenPhong': 'asc'})
        .then(result => {
        res.status(200).json(result);
      }).catch(error => {
        res.status(400).json({err: error});
      });
      break;
    case 'truong':
      Truong.find().sort({'tenTruong': 'asc'})
        .then(result => {
        res.status(200).json(result);
      }).catch(error => {
        res.status(400).json({err: error});
      });
      break;
  }
};