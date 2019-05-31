require('../models/TaiKhoan');
const Profile = require('../models/Profile');
const Account = require('../models/TaiKhoan');
const Room = require('../models/Phong');
const RoomHistory = require('../models/LichSuPhong');
const ActivityResults = require('../models/KetQuaHD');
const Activity = require('../models/HoatDong');
const ReToken = require('../models/refreshToken');
let auth = require('../repos/authRepo');
const md5 = require('md5');
var fs = require('fs')

function addOneStudent(data) {
  return new Promise( (resolve, reject) => {
    Account.findOne({username: data.mssv})
    .then( result => {
      if(result){
        resolve( {status: 409, msg: 'Mã số sinh viên đã tồn tại!', data: data})
      } else {
        let acc = new Account({
          username: data.mssv,
          password: md5(data.mssv),
          loai: "SV",
          isDelete: 0,
        });
        //----save account---------
        acc.save().catch(err =>{
          resolve( {status: 400, msg: 'tạo tài khoản không thành công!', data: data})
        })

        let student = new Profile({
          idTaiKhoan: acc._id,
          hoTen: data.hoTen,
          MSSV: data.mssv,
          ngaySinh: data.ngaySinh,
          ngayVaoO: new Date(),
          ngayHetHan: data.ngayHetHan,
          flag: true
        });
        //------save profile-------
        student.save().catch(err =>{
          resolve( {status: 400, msg: 'tạo thông tin cá nhân không thành công!', data: data})
        })

        acc.idProfile = student._id;
        acc.save().catch(err =>{
          resolve( {status: 400, msg: 'tạo tài khoản không thành công!', data: data})
        })

        resolve( {status: 200, msg: 'Thêm sinh viên thành công!', data: data})
      }
    }).catch(err => {
      resolve( {status: 500, msg: 'truy vấn mssv thẻ err!', data: data})
    });
  })

};

exports.addStudent =async (req, res) => {
  const params = req.body;
  if( !params.mssv && !params.hoTen)
    res.status(400).json({msg: 'Thiếu thông tin'});
  console.log(params);
  addOneStudent(params).then(resolve => {
    res.status(resolve.status).json({msg: resolve.msg})
  }).catch(reject => {
    res.status(reject.status).json({msg: reject.msg})

  })
};

exports.importFile = async (req, res) => {
  const { data, expireDay } = req.body;
  let listExpired = [];
  let listSuccess =[];
  let listPromise = []
  data.forEach(record => {
    let student = {
      mssv: record.mssv,
      hoTen: record.hoTen,
      ngaySinh: record.ngaySinh,
      ngayHetHan: req.body.ngayHetHan,
      hanDangKy: req.body.hanDangKy
    }
    listPromise.push(addOneStudent(student))
  })
  await Promise.all(listPromise).then(result=> {
    let i = 0;
    result.forEach(r => {
      if(r.status !== 200)
        listExpired.push({...r, key: i++})
    });
    listSuccess = result.forEach(r => {
      if(r.status === 200)
        listSuccess.push({...r, key: i++});
    });
  }).catch();
  if (listExpired.length !== 0){
    res.status(400).json({
      list: listExpired
    })
  }
  else
      res.status(200).json({
        msg: 'success all', data: listSuccess
      })
};

exports.deleteStudent = (req, res) => {
  const arrDel = req.body.arrDelete;
  if(arrDel === undefined || arrDel.length == 0) {
    res.status(400).json({msg: 'Không có dữ liệu để xóa'})
  }
  else {
    arrDel.forEach(id => {
      Account.findOneAndUpdate({username: id},{ $set: {isDelete: 1} })
        .then(result => {
          Profile.findOneAndUpdate({MSSV: id},{ $set: {idPhong: null} })
            .then(result => {
              if(result.idPhong){
                Room.findOne({_id:result.idPhong})
                  .then(result => {
                    result.soNguoi = result.soNguoi - 1;
                    result.save()
                  }).catch()
              }
              res.status(200).json({msg: 'Bạn đã xóa thành công'})
            }).catch(err =>
            res.status(400).json({msg: 'Xóa thất bại'})
          )
        }).catch(err => {
        res.status(400).json({msg: 'Xóa thất bại'})
      })
    })
  }

};

exports.updateInfo = (req,res) => {
  const info = req.body.info;
  Profile.findOne({MSSV: info.MSSV})
    .then(async(result) => {
      //if change number card
      if(info.maThe !== result.maThe){
        await Profile.findOne({maThe: info.maThe})
          .then(result => {
            if(result){
              res.status(400).json({msg: 'Mã thẻ đã tồn tại'})
            }
          }).catch(err => {
            res.status(400)
        })
      }
      // if change room
      if(info.idPhong !== result.idPhong) {
        //create room history
        const history  = {
          idTaiKhoan: info.idTaiKhoan,
          idPhong: info.idPhong,
          ngayChuyen: new Date()
        };
        let his = new RoomHistory(history);
        his.save().then(() => {
          res.status(200).json({msg: 'Cập nhật thành công!'})
        }).catch(err => {
          res.status(400).json({msg: 'Cập nhật lịch sử phòng không thành công'})
        })
      }
    }).catch(err => {
      res.status(400).json({msg: 'cập nhật không thành công!'})
  }).then(()=>{
      Profile.findOneAndUpdate({MSSV: info.MSSV},{ $set: info }).then(result => {
        res.status(200).json({data: result, msg: 'Cập nhật thành công!'})
      }).catch()
  }
  ).catch()
};

exports.getListStudent = async(req, res) => {
  let query = {};
  const params = req.body;

  var populateQuery = [
    {path:'idPhong', select:'tenPhong'},
    {path:'truong', select:'tenTruong'},
    {path:'nganhHoc', select:'tenNganh'},
  ];

  if(params.hoTen)
    query.hoTen = { $regex: '.*' + params.hoTen + '.*', $options: 'i' };
  if(params.mssv)
    query.MSSV = { $regex: '.*' + params.mssv + '.*', $options: 'i' };

  if(params.idPhong && params.idPhong!== -1)
    query.idPhong = params.idPhong;
  else if(params.idPhong === -1)
    query.idPhong = {"$exists": false};

  if(params.idTruong && params.idTruong!== -1)
    query.truong = params.idTruong;
  else if(params.idTruong === -1)
    query.truong = {"$exists": false};

  if(params.nam && params.nam !== 0){
    let startTime =  new Date(params.nam, 1, 1);
    startTime.setHours(0,0,0,0);
    let endTime = new Date(params.nam + 1, 1, 1);
    endTime.setHours(0,0,0,0);
    query.ngayVaoO = {$gte: startTime, $lt: endTime}
  }

  if(params.lau !== 0)
    await Room.find({lau: params.lau}).select('_id').then(result => {
    var arr = [];
    result.forEach(acc => {
      arr.push(acc._id)
    });
    query.idPhong = {$in: arr}
  });

  Account.find({isDelete: params.isOld, loai: 'SV'})
    .select('_id')
    .then(accs => {
      var arr = [];
      accs.forEach(acc => {
        arr.push(acc._id)
      });
      query.idTaiKhoan = {$in : arr};
      Profile.find(query)
        .populate(populateQuery)
        .then(result => {
          res.status(200).json(result);
        }).catch(err => {
        res.status(400).json(err);
      })
    })

};

exports.getListStudentPaging = async(req, res) => {
  let query = {};
  const params = req.body;
  if(params.hoTen)
    query.hoTen = { $regex: '.*' + params.hoTen + '.*', $options: 'i' };
  if(params.mssv)
    query.MSSV = { $regex: '.*' + params.mssv + '.*', $options: 'i' };

  if(params.idPhong && params.idPhong!== -1)
    query.idPhong = params.idPhong;
  else if(params.idPhong === -1)
    query.idPhong = {"$exists": false};

  if(params.idTruong && params.idTruong!== -1)
    query.truong = params.idTruong;
  else if(params.idTruong === -1)
    query.truong = {"$exists": false};

  if(params.nam && params.nam !== 0){
    let startTime =  new Date(params.nam, 1, 1);
    startTime.setHours(0,0,0,0);
    let endTime = new Date(params.nam + 1, 1, 1);
    endTime.setHours(0,0,0,0);
    query.ngayVaoO = {$gte: startTime, $lt: endTime}
  }

  if(!params.options)
    res.status(400).json({'msg': 'missing options'});

  let options = params.options;
  options.populate = ['idTaiKhoan','idPhong', 'truong', 'nganhHoc'];

  if(params.lau !== 0)
    await Room.find({lau: params.lau}).select('_id').then(result => {
      var arr = [];
      result.forEach(acc => {
        arr.push(acc._id)
      });
      query.idPhong = {$in: arr}
    });


  Account.find({isDelete: params.isOld, loai: 'SV'}).select('_id')
    .then(accs => {
    var arr = [];
    accs.forEach(acc => {
      arr.push(acc._id)
    });
    query.idTaiKhoan = {$in : arr};
    Profile.paginate(query, options)
      .then(result => {
        res.status(200).json(result);
      }).catch(err => {
        res.statusCode(400).json({
          err: 'get info student fail'
        })
    })
  }).catch()
};

exports.getRoomHistory = async(req, res) => {
  const id = req.params.id;

  await RoomHistory.find({idTaiKhoan: id}).populate('idPhong').sort({ ngayChuyen: 1 }).
    then(async(result) => {
    res.status(200).json(result)

  }).catch(err => {
      res.status(400)
  })
}

exports.uploadImage = (req, res) => {
  console.log(req.body);
  res.json({
    rs: 'success',
  })
};

exports.getListActivitiesByMSSV = (req, res) => {
  const mssv = req.params.mssv;
  Profile.findOne({MSSV: mssv})
    .then(result => {
      ActivityResults.find({idSV: result._id})
        .populate({path:'idHD'})
        .then(result => {
          res.status(200).json(result)
        }).catch(err => {
        res.status(400).json({msg: "Lỗi"})
      })
    })

};

exports.getProfile = async (req, res) => {
  const mssv = req.params.mssv;
  let populateQuery = [
    {path:'idTaiKhoan', select: 'isDelete'},
    {path:'idPhong'},
    {path:'truong'},
    {path:'nganhHoc'},
  ];

  Profile.findOne({MSSV: mssv})
    .populate(populateQuery)
    .then((result) => {
      res.status(200).json(result)
    }).catch(err => {
      res.status(400).json({msg: 'Có lỗi'})
  })
};
