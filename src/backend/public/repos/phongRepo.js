const Phong = require('../models/Phong');

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
}