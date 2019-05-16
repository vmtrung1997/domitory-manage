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
        console.log('==exits ')
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
      console.log('==err mssv', err)
      resolve( {status: 500, msg: 'truy vấn mssv thẻ err!', data: data})
    });
  })

};

exports.addStudent =async (req, res) => {
  const params = req.body;
  if( !params.mssv && !params.hoTen)
    res.status(400).json({msg: 'Thiếu thông tin'});

  addOneStudent(params).then(resolve => {
    console.log('==add one', resolve)
    res.status(resolve.status).json({msg: resolve.msg})
  }).catch(reject => {
    console.log('==err add one', reject)
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
  }).catch()
  if (listExpired.length !== 0){
    console.log('==listExpired',listExpired);
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
  console.log('==body', req.body, arrDel);
  if(arrDel === undefined || arrDel.length == 0) {
    console.log('==rỗng')
    res.status(400).json({msg: 'Không có dữ liệu để xóa'})
  }
  else {
    arrDel.forEach(id => {
      console.log('==id', id);
      Account.findOneAndUpdate({username: id},{ $set: {isDelete: 1} })
        .then(result => {
          console.log('==findone', result)
          Profile.findOneAndUpdate({MSSV: id},{ $set: {idPhong: null} })
            .then(result => {
              console.log('==ahihi', result);
              if(result.idPhong){
                Room.findOne({_id:result.idPhong})
                  .then(result => {
                    console.log('==Phong', result)
                    result.soNguoi = result.soNguoi - 1;
                    result.save()
                  })
              }
              res.status(200).json({msg: 'Bạn đã xóa thành công'})
            }).catch(err =>
            res.status(400).json({msg: 'Xóa thất bại 222'})
          )
        }).catch(err => {
        res.status(400).json({msg: 'Xóa thất bại'})
      })
    })
  }

};

exports.updateInfo = (req,res) => {
  const info = req.body.info;
  Profile.findOneAndUpdate({MSSV: info.MSSV},{ $set: info })
    .then(result => {
      // if change room
      if(info.idPhong !== result.idPhong) {
        //update number of person in old room
        if (result.idPhong) {
          Room.findOne({_id: result.idPhong})
            .then(result => {
              result.soNguoi = result.soNguoi - 1;
              result.save()
            }).catch(err => {
            res.status(400).json({msg: 'Cập nhật phòng cũ không thành công!'})
          })
        }
        //update number of person in new room
        Room.findOne({_id : info.idPhong})
          .then(result => {
            result.soNguoi = result.soNguoi + 1;
            result.save()
          }).catch(err => {
          res.status(400).json({msg: 'Cập nhật phòng mới không thành công!'})
        })

        //create room history
        const history  = {
          idTaiKhoan: info.idTaiKhoan,
          idPhong: info.idPhong,
          ngayChuyen: new Date()
        }
        let his = new RoomHistory(history);
        his.save().then(result => {
          res.status(200).json({msg: 'Cập nhật thành công!'})
        }).catch(err => {
          console.log('==roomHis', err);
          res.status(400).json({msg: 'Cập nhật lịch sử phòng không thành công'})
        })
      }
      res.status(200).json({msg: 'Cập nhật thành công!'})
    }).catch(err => {
      res.status(400).json({msg: 'cập nhật không thành công!'})
  })
};

exports.getListStudent = (req, res) => {
  console.log('==test');
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

exports.getListStudentPaging = (req, res) => {
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

  if(!params.options)
    res.status(400).json({'msg': 'missing options'});
  //query = {...query, truong:{$nin: [null, '']}};
  //query.idTaiKhoan =  {isDelete: 0};

  let options = params.options;
  options.populate = ['idTaiKhoan','idPhong', 'truong', 'nganhHoc'];

  Account.find({isDelete: params.isOld, loai: 'SV'}).select('_id').then(accs => {
    console.log('==accs', accs)
    var arr = [];
    accs.forEach(acc => {
      arr.push(acc._id)
    });
    query.idTaiKhoan = {$in : arr};
    Profile.paginate(query, options)
      .then(result => {
        res.status(200).json(result);
      }).catch(err => {
      console.log('==fail', err);

      res.statusCode(400).json({
        err: 'get info student fail'
      })
    })
  })

  //}
};

exports.getRoomHistory = async(req, res) => {
  console.log('==his', req.params.id);
  const id = req.params.id;

  await RoomHistory.find({idTaiKhoan: id}).populate('idPhong').sort({ ngayChuyen: 1 }).
    then(async(result) => {
      console.log('==his', result);
    res.status(200).json(result)

  }).catch(err => {
      console.log('==err', err)
      res.status(400)
  })

}

exports.uploadImage = (req, res) => {
  console.log(req.body);
  res.json({
    rs: 'success',
  })
};

exports.getListActivities = (req, res) => {
  const id = req.params.id;
  ActivityResults.find({idSV: id})
    .populate({ path: "idHD" })
    .then(result => {
      res.status(200).json(result)
  }).catch(err => {
    res.status(400).json({msg: "Lỗi"})
  })
};

exports.getDetail = async (req, res) => {
  const id = req.params.id;
  let data = {
    activity: {},
    profile: {}
  };
  //get activities
  let getData = async (id, callback) => {
    await ActivityResults.find({idSV: id})
      .populate({ path: "idHD" })
      .then(result => {
        data.activity.list = result;
      });

    // get activity point
    var result = [];
    var ngayVaoO = new Date(req.body.ngayVaoO);
    if (ngayVaoO === undefined) {
      data.activity.point = 0
    }
    await ActivityResults.find({ idSV: req.body.id })
      .populate({
        path: "idHD",
        match: {
          ngayBD: { $gte: ngayVaoO }
        },
        select: "diem batBuoc ten diaDiem ngayBD ngayKT thang nam"
      })
      .then(rs => {
        var year = ngayVaoO.getFullYear();
        var now = new Date();
        for (var yearpoint = year; yearpoint <= now.getFullYear(); yearpoint++) {
          var point = 0;
          var i = 0;
          rs.some(item => {
            if (
              (item.idHD.ngayKT.getMonth() + 1 > 7 &&
                item.idHD.ngayKT.getFullYear() > yearpoint + 1) ||
              (item.idHD.ngayKT.getMonth() + 1 < 8 &&
                item.idHD.ngayKT.getFullYear() === yearpoint) ||
              (item.idHD.ngayKT.getFullYear() < yearpoint ||
                item.idHD.ngayKT.getFullYear() > yearpoint + 1) ||
              (item.idHD.ngayKT.getMonth() + 1 > now.getMonth() + 1)
            ) {
              return true;
            }
            else {
              if (item.idHD.batBuoc && !item.isTG) {
                point -= item.idHD.diem;
              } else if (item.isTG) {
                point += item.idHD.diem;
              }
            }
          });

          var temp = {
            year: yearpoint,
            point: point
          };

          result.push(temp);
        }

        data.activity.point = result;
      });

    // // get profile
    let populateQuery = [
      {path:'idTaiKhoan', select: 'isDelete'},
      {path:'idPhong'},
      {path:'truong'},
      {path:'nganhHoc'},
    ];

    await Profile.findOne({MSSV: id})
      .populate(populateQuery)
      .then(result => {
        data.profile = result;
      });

    callback(data);
  };

  getData(id, (data) => {
      res.status(200).json(data);
  });
};
