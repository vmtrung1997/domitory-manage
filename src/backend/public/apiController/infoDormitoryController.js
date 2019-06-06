const Room = require('../models/Phong');
const RoomType = require('../models/LoaiPhong');
const RoomParams = require('../models/ChiSoHienTai');
const Profile = require('../models/Profile');


function getRoomDetail(floor){
  return new Promise((resolve, reject) => {
    Room.find({ lau: floor }).populate({
      path: 'loaiPhong',
      options: { sort: { name: -1 } }
    }).exec(async(err, kittens) => {
      if (err){
        console.log('==err ',err);
        reject(err);
      }
      else {
        let listPromise = [];
        kittens.forEach(async(room) => {
          listPromise.push(getPersonInRoom(room._doc))
        });
        Promise.all(listPromise).then(result => {
          resolve(result)
        }).catch(err => {
          reject(err);
        })
      }
    })
  })
}

function getPersonInRoom(room){
  return new Promise((resolve) => {
    Profile.countDocuments({idPhong: room._id},function (err, count){
      if(err)
        resolve({...room, soNguoi: -1});
      else
        resolve({...room, soNguoi: count});
    })
  })

}
exports.getRoom = async (req, res) => {
  const floor = req.params.floor;
  getRoomDetail(floor).then(async(result) => {
    res.status(200).json(result)
  }).catch(err => {
    res.status(400).json(err)
  })
};

exports.addRoom = async(req, res) => {
  await Room.findOne({ tenPhong: req.body.tenPhong, lau: req.body.lau }).then(result => {
    if (result)
      res.status(409).json({ msg: 'Tên phòng đã tồn tại' });
    else{
      const newRoom = {
        tenPhong: req.body.tenPhong,
        lau: req.body.lau,
        soNguoi: 0,
        soNguoiToiDa: req.body.soNguoiToiDa,
        loaiPhong: req.body.loaiPhong,
        gioiTinh: req.body.gioiTinh,
        moTa: req.body.moTa
      };

      let room = new Room(newRoom);
      room.save().then(result => {
        const today = new Date();
        const chiSoPhong = {
          idPhong: result._id,
          thang: today.getMonth(),
          nam: today.getFullYear(),
          soDien: req.body.soDien,
          soNuoc: req.body.soNuoc,
        };

        let roomParams = new RoomParams(chiSoPhong);
        roomParams.save().then(() => {
          res.status(200).json({ msg: 'Tạo phòng thành công' })
        }).catch(err => {
          res.status(400).json({ msg: 'Tạo phòng không thành công', err: err })
        })
      }).catch(err => {
        res.status(400).json({ msg: 'Tạo phòng không thành công', err: err })
      })
    }
  }).catch(err => {
    res.status(400).json({ msg: 'Tạo phòng không thành công', err: err })
  });
};

exports.delRoom = (req, res) => {
  const id = req.params.id;
  Profile.findOne({ idPhong: id }).then(result => {
    if (result)
      res.status(409).json({ msg: "Phòng này đang có người sử dụng không thể xóa!!" });
    else
      Room.findOneAndRemove({_id:id}).then(result => {
        // Delete electric number and water number
        RoomParams.findOneAndRemove({ idPhong: result._id }).then(() => {
          res.status(200).json({ msg: 'Xóa phòng thành công' })
        }).catch(err => {
          res.status(401).json({ msg: 'Xóa chỉ số phòng không thành công', err: err })
        })
      }).catch(err => {
        res.status(401).json({ msg: 'Xóa phòng không thành công', err: err })
      })
  }).catch(err => {
    res.status(400).json({ msg: 'Xóa phòng không thành công', err: err })
  })
};

exports.updateRoom = (req, res) => {
  const params = req.body;
  Room.findOne({ _id: params.id })
    .then(result => {
      if (result.soNguoi > params.soNguoiToiDa)
        res.status(409).json({ msg: 'Không thể cập nhật vì số người đang ở lớn hơn số người tối đa bạn muốn cập nhật!' });
      result.soNguoiToiDa = params.soNguoiToiDa ? params.soNguoiToiDa : result.soNguoiToiDa;
      result.moTa = params.moTa ? params.moTa : result.moTa;
      result.loaiPhong = params.loaiPhong ? params.loaiPhong : result.loaiPhong;
      result.gioiTinh = params.gioiTinh ? params.gioiTinh : result.gioiTinh;
      result.save();
      res.status(200).json({ msg: 'Cập nhật thành công!!' })
    }).catch(err =>
      res.status(400).json({ msg: 'Có lỗi xảy ra, vui lòng thử lại!!', err: err })
    )
};

exports.getRoomType = (req, res) => {
  RoomType.find().then(result => {
    res.status(200).json(result)
  }).catch(err => {
    res.status(400).json({ msg: 'Lấy danh sách loại phòng không thành công!', err: err })
  })
};

exports.addRoomType = (req, res) => {
  var { data } = req.body;
  console.log(data);
  var roomType = new RoomType({
    loai: data.loai,
    ten: data.ten,
    dien: data.dien,
    nuoc: data.nuoc,
    tienRac: data.tienRac
  });
  roomType.save().then(value => {
    if (value) {
      res.json({
        rs: 'success',
        data: value
      })
    }
  }).catch(() => {
    res.json({
      rs: 'fail'
    })
  })
};

exports.updateRoomType = (req, res) => {
  let { data } = req.body;
  console.log(data);
  RoomType.findOne({ _id: data._id })
    .then(roomType => {
      if (roomType) {
        let object = {
          loai: data.loai,
          ten: data.ten,
          dien: data.dien,
          nuoc: data.nuoc,
          tienRac: data.tienRac
        };
        RoomType.updateOne({ _id: data._id }, object, err => {
          if (err) {
            res.json({
              rs: 'fail'
            })
          } else {
            res.json({
              rs: 'success',
              msg: 'Lỗi update'
            })
          }
        })
      } else res.json({
        rs: 'fail'
      })

    }).catch(err => {
      res.json({
        rs: 'fail',
        msg: err
      })
    })
};

exports.removeRoomType = (req, res) => {
  var { data } = req.body;
  Room.findOne({loaiPhong: data._id}).then(value => {
    if (value){
      res.json({
        rs: 'fail',
        msg: 'Không thể xóa loại phòng có chứa phòng'
      })
    } else {
      RoomType.deleteOne({_id: data._id}).then(err => {
        if (err.ok){
          res.json({
            rs: 'success',
          })
        } else {
          res.json({
            rs: 'fail',
          })
        }
      })
    }
  })
};

exports.getFloorRoom = async (req, res) => {
  await Room.distinct('lau')
    .then(async(result) => {
    result.sort();
    let i = 0;
    let listPromise = [];
    let data = [];
    await result.forEach(async(floor) => {
      listPromise.push(getRoomDetail(floor));
    });
      await Promise.all(listPromise).then(result=> {
        data = result.map(rooms => ({key: i++, floor: rooms[0].lau, rooms: rooms}));

        res.status(200).json(data)
      }).catch()

    }).catch(err => {
    res.status(400).json({err: err});
  })
};

exports.getPersonInRoom = (req, res) => {
  const id = req.params.idPhong;
  Profile.find({idPhong: id})
    .populate({
      path: 'truong',
      select: 'tenTruong'
    })
    .select('MSSV hoTen truong')
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => console.log('==err getperson in room', err))
};