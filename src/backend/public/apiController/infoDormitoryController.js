const Room = require('../models/Phong');
const RoomType = require('../models/LoaiPhong');
const RoomParams = require('../models/ChiSoHienTai');


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
    loaiPhong: req.body.loaiPhong
  };

  let room = new Room(newRoom);
  room.save().then(result => {
    console.log('==success add room', result);
    const today = new Date ()
    const chiSoPhong = {
      idPhong: result._id,
      thang: today.getMonth(),
      nam: today.getFullYear(),
      soDien: req.body.soDien,
      soNuoc: req.body.soNuoc,
    };
    console.log('==success add room222', chiSoPhong);

    let roomParams = new RoomParams(chiSoPhong);
    roomParams.save().then(result => {
      console.log('==success add chiso', result);

      res.status(200).json({msg: 'Tạo phòng thành công'})
    }).catch(err => {
      res.status(400).json({msg: 'Tạo phòng không thành công'})
    })
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
      RoomParams.findOneAndRemove({idPhong: result._id}).then(result => {
        res.status(200).json({msg: 'Xóa phòng thành công'})
      }).catch(err =>{
        res.status(401).json({msg: 'Xóa không thành công'})
      })
    }).catch(err =>{
      res.status(401).json({msg: 'Xóa không thành công'})
    })
  }).catch(err => {
    res.status(400).json({msg: 'Xóa không thành công'})
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
      result.loaiPhong = params.loaiPhong ? params.loaiPhong : result.loaiPhong;
      result.save()
      res.status(200).json({msg: 'Cập nhật thành công!!'})
    }).catch(err =>
      res.status(400).json({msg: 'Có lỗi xảy ra, vui lòng thử lại!!'})
  )
};

exports.getRoomType = (req, res) => {
  RoomType.find().then(result => {
    res.status(200).json(result)
  }).catch(err => {
    res.status(400).json({msg: 'Lấy danh sách loại phòng không thành công!'})
  })
}