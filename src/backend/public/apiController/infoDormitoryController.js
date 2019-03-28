const Room = require('../models/Phong');

exports.getRoom = (req, res) => {
  const floor = req.params.floor;
  Room.find({lau: floor}).then(result => {
    res.status(200).json(result)
  }).catch(err => {
    res.status(400)
  })
}