const Room = require('../models/Phong');
require('../models/LoaiPhong');

exports.getRoom = async(req, res) => {
  const floor = req.params.floor;
  console.log('==floor', floor)
  let roomList = {};
  Room.find({ lau: floor }).populate({
    path: 'loaiPhong',
    options: { sort: { name: -1 } }
  }).exec(function (err, kittens) {
    if (err)
      res.status(400)
    console.log(kittens[0]) // Zoopa
    res.status(200).json(kittens)
  })
  //   .then(result => {
  //   roomList.normal = result;
  //   console.log('====', roomList)
  // }).catch(err => {
  //   res.status(400)
  // });

  // await Room.find({lau: floor, isHoDan: -1}).then(result => {
  //   roomList.service = result;
  // }).catch(err => {
  //   res.status(400)
  // })
  // console.log('11111', roomList)
  //
  // res.status(200).json(roomList)
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
};

exports.updateRoom = (req, res) => {
  const params = req.body;
  Room.findOne({_id: params.id})
    .then(result => {
      if (result.soNguoi > params.soNguoiToiDa)
        res.status(409).json({msg: 'Không thể cập nhật vì số người đang ở lớn hơn số người tối đa bạn muốn cập nhật!'})
      result.soNguoiToiDa = params.soNguoiToiDa ? params.soNguoiToiDa : result.soNguoiToiDa;
      result.moTa = params.moTa ? params.moTa : result.moTa;
      result.save()
      res.status(200).json({msg: 'Cập nhật thành công!!'})
    }).catch(err =>
      res.status(400).json({msg: 'Có lỗi xảy ra, vui lòng thử lại!!'})
  )
};