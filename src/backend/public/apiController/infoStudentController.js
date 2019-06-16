require('../models/TaiKhoan');
const Profile = require('../models/Profile');
const Account = require('../models/TaiKhoan');
const Room = require('../models/Phong');
const RoomHistory = require('../models/LichSuPhong');
const ActivityResults = require('../models/KetQuaHD');
const md5 = require('md5');

function usernameInvalid(username){
  const ortherChar = username.replace(/[A-Za-z0-9]/gi, '');
  return !!ortherChar;
}

function addOneStudent(data) {
  return new Promise( (resolve) => {
    if(usernameInvalid(data.mssv))
      resolve({status: 400, msg: 'MSSV không hợp lệ', data: data});
    else {
      Account.findOne({username: data.mssv})
        .then( result => {
          console.log('==find stu ', result)
          if(result){
            if(!result.isDelete){
              resolve( {status: 409, msg: 'Mã số sinh viên đã tồn tại!', data: data});
            }
            else {//if student in old student
              result.isDelete = 0;
              result.save()
                .then(() => {
                  resolve( {status: 200, msg: 'Sinh viên đã được tiếp tục ở lại!', data: data})
                }).catch(
                resolve({status: 400, msg: 'Chuyển đổi không thành công!', data: data, err: err})
              )
            }
          } else {
            let acc = new Account({
              username: data.mssv,
              password: md5(data.mssv),
              loai: "SV",
              isDelete: 0,
            });
            //----save account---------
            acc.save()
              .then(acc => {
                let student = new Profile({
                  idTaiKhoan: acc._id,
                  hoTen: data.hoTen,
                  MSSV: data.mssv,
                  ngaySinh: data.ngaySinh,
                  ngayVaoO: new Date(),
                  ngayHetHan: data.ngayHetHan,
                  hanDangKy: data.hanDangKy,
                  isActive: false,
                  flag: true
                });
                //------save profile-------
                student.save()
                  .then((result) => {
                    resolve( {status: 200, msg: 'Thêm sinh viên thành công!', data: data})
                  })
                  .catch(err =>{
                    Account.findOneAndDelete({username: data.mssv}).catch()
                    resolve( {status: 400, msg: 'tạo thông tin cá nhân không thành công, vui lòng thử lại!', data: data, err: err})
                  });

                acc.idProfile = student._id;
                acc.save().catch(err =>{
                  resolve( {status: 400, msg: 'tạo tài khoản không thành công!', data: data, err: err})
                });
              })
              .catch(() =>{
                resolve( {status: 400, msg: 'tạo tài khoản không thành công!', data: data})
              });
          }
        }).catch(err => {
        console.log('==truy van err', err)
        //resolve( {status: 500, msg: 'Truy vấn mssv không được!', data: data, err: err})
      });
    }
  })
}

exports.addStudent =async (req, res) => {
  const params = req.body;
  if( !params.mssv && !params.hoTen)
    res.status(400).json({msg: 'Thiếu thông tin'});
  addOneStudent(params).then(resolve => {
    res.status(resolve.status).json({msg: resolve.msg})
  }).catch(reject => {
    res.status(reject.status).json({msg: reject.msg})

  })
};

exports.importFile = async (req, res) => {
  const { data } = req.body;
  let listExpired = [];
  let listSuccess =[];
  let listPromise = [];
  data.forEach(record => {
    let [ngay, thang, nam] = [0, 0 , 0]
    if(record.ngaySinh)
      [ngay, thang, nam] = record.ngaySinh.split("/");
    let student = {
      mssv: record.mssv,
      hoTen: record.hoTen,
      ngaySinh: record.ngaySinh ? new Date(`${thang}/${ngay}/${nam}`) : new Date(),
      ngayHetHan: req.body.ngayHetHan,
      hanDangKy: req.body.hanDangKy
    };
    listPromise.push(addOneStudent(student))
  });
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

exports.convertStudent = (req, res) => {
  const arrStudent = req.body.arrStudent;
  const option= req.body.option;  // option = 0 => student at present

  if(arrStudent === undefined || arrStudent.length === 0) {
    res.status(400).json({msg: 'Không có dữ liệu để xóa'})
  }
  if(typeof option === 'undefined')
    res.status(400).json({msg: 'Thiếu option'});
  else {
    arrStudent.forEach(id => {
      Account.findOneAndUpdate({username: id},{ $set: {isDelete: option ? 0 : 1} })
        .then(() => {
          Profile.findOneAndUpdate(
            {MSSV: id},
            { $set: {
              idPhong: null,
              isActive: false,
              hanDangKy: option ? req.body.regisExpiredDate : null,
              ngayHetHan: option ? req.body.dayOut : new Date()
            } })
            .then(() => {
              res.status(200).json({msg: 'Bạn đã xóa thành công'})
            }).catch(err =>
            res.status(400).json({msg: 'Xóa thất bại', err: err})
          )
        }).catch(err => {
        res.status(400).json({msg: 'Xóa thất bại', err: err})
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
            res.status(400).json(err)
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
          res.status(400).json({msg: 'Cập nhật lịch sử phòng không thành công', err: err})
        })
      }
    }).catch(err => {
      res.status(400).json({msg: 'cập nhật không thành công!', err: err})
  }).then(()=>{
      Profile.findOneAndUpdate({MSSV: info.MSSV},{ $set: info }).then(result => {
        res.status(200).json({data: result, msg: 'Cập nhật thành công!'})
      }).catch()
  }
  ).catch()
};

function getActivityPoint(user){
  let year = new Date().getFullYear();
  if(new Date().getMonth() < 7)
    year--;
  return new Promise((resolve, reject) => {
    ActivityResults.find({ idSV: user._id })
      .populate({
        path: "idHD",
        match: {
          ngayBD: {
            $lte: new Date(year + 1, 7, 31),
            $gte: new Date(year, 8, 1)
          },
        },
        select: "ten diem batBuoc ngayBD ngayKT"
      })
      .then( rs => {
        let term1 = 0;
        let term2 = 0;
        let profile = {...user._doc, point: {term1: term1, term2: term2}};
        rs.forEach(acti => {
          if(acti.idHD){
            const month = new Date(acti.idHD.ngayBD).getMonth();
            if(acti.idHD.batBuoc || !acti.isTG)
              if( month > 1 && month < 9 )
                term2 -= acti.idHD.diem;
              else
                term1 -= acti.idHD.diem;
            if(acti.isTG)
              if( month > 1 && month < 9 )
                term2 += acti.idHD.diem;
              else
                term1 += acti.idHD.diem;
          }
          profile.point = {term1: term1, term2: term2};
        });
        resolve(profile)
      })
      .catch(err => {
        reject(err)
      })
  })
}

exports.getListStudent = async(req, res) => {
  let query = {};
  const params = req.body;

  let populateQuery = [
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
    let arr = [];
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
        .select('_id idTaiKhoan CMND hoTen ngaySinh gioiTinh email diaChi sdt MSSV tonGiao nganhHoc truong idPhong moTa sdtNguoiThan ngayVaoO ngayHetHan danToc')
        .populate(populateQuery)
        .then(async(rs) => {
          let result = [];

          if(params.getPoint){
              rs.forEach(user => {
                result.push(getActivityPoint(user))
              });
              Promise.all(result).then(result => {
                res.status(200).json(result);
              })
          }
          else{
            result = [...rs];
            res.status(200).json(result);
          }
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
          msg: 'get info student fail',
          err: err
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
      res.status(400).json(err)
  })
};

exports.uploadImage = (req, res) => {
  console.log(req.body);
  res.json({
    rs: 'success',
  })
};

exports.getListActivitiesByMSSV = (req, res) => {
  const MSSV = req.params.mssv;
  Profile.findOne({MSSV: MSSV}, (err, val) => {
    if(err){
      res.status(400).json(err)
    }
    if(val){
      var year = new Date().getFullYear();
      if(new Date().getMonth() < 7)
        year--;
      ActivityResults.find({ idSV: val._id })
        .populate({
          path: "idHD",
          match: {
            ngayBD: {
              $lte: new Date(year + 1, 7, 31),
              $gte: new Date(year, 8, 1)
            },
          },
          select: "ten diem batBuoc ngayBD ngayKT"
        })
        .then( rs => {
          let result = [];
          let term1 = 0;
          let term2 = 0;
          rs.forEach(record => {
            if(record.idHD){
              let acti = {...record._doc};
              acti.isEnd = new Date() > acti.idHD.ngayKT;
              result.push(acti);
              const month = new Date(acti.idHD.ngayBD).getMonth();
              if(acti.idHD.batBuoc || !acti.isTG)
                if( month > 1 && month < 9 ){
                  acti.term = '2';
                  term2 -= acti.idHD.diem;
                }
                else{
                  acti.term = '1';
                  term1 -= acti.idHD.diem;
                }

              if(acti.isTG)
                if( month > 1 && month < 9 )
                  term2 += acti.idHD.diem;
                else
                  term1 += acti.idHD.diem;
            }
          });
          res.status(200).json({activities: result, point: {term1: term1, term2: term2}})
        })
        .catch(err => {
          res.status(400).json(err);
      })
    }
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
    }).catch(() => {
      res.status(400).json({msg: 'Có lỗi'})
  })
};
