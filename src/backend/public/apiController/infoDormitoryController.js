const Room = require('../models/Phong');

exports.getRoom = (req, res) => {
  const floor = req.params.floor;
  Room.find({lau: floor, isHoDan: 0}).then(result => {
    res.status(200).json(result)
  }).catch(err => {
    res.status(400)
  })
};

exports.addRoom = (req, res) => {
  Room.findOne({tenPhong: req.body.tenPhong, lau: req.body.lau}).then(result => {
    console.log('==find room', result)
    if(result)
      res.status(409).json({msg:'Tên phòng đã tồn tại'})
  }).catch(err => {
    console.log('==err find room');
  });

  const newRoom = {
    tenPhong: req.body.tenPhong,
    lau: req.body.lau,
    soNguoi: 0,
    soNguoiToiDa: req.body.soNguoiToiDa,
    trangThai: req.body.trangThai ? 'Sử dụng' : 'Chưa sử dụng',
    isHoDan: 0,
    moTa: req.body.moTa
  };

  let room = new Room(newRoom);
  room.save().then(result => {
    console.log('==success add room', result);
    res.status(200).json({msg: 'Tạo phòng thành công'})
  }).catch(err => {
    res.status(400).json({msg: 'Tạo phòng không thành công'})
  })
};

exports.delRoom  = (req, res) => {
  const id = req.params.id;
  Room.findOne({_id: id}).then(result => {
    if(result.soNguoi !== 0)
      res.status(409).json({msg: "Phòng này đang có người sử dụng không thể xóa!!"})
    result.remove().then(result => {
      res.status(200).json(result)
    }).catch(err =>{
      res.status(401).json({msg: 'Xóa không thành công1'})
    })
  }).catch(err => {
    res.status(400).json({msg: 'Xóa không thành công2'})
  })
}