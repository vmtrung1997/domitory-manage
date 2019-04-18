
require('../models/TaiKhoan');
//require('../models/NganhHoc');
const Profile = require('../models/Profile');
const Account = require('../models/TaiKhoan');
const Room = require('../models/Phong');
const RoomHistory = require('../models/LichSuPhong');
const ReToken = require('../models/refreshToken');
let auth = require('../repos/authRepo');
const md5 = require('md5');

exports.addStudent = (req, res) => {
  const params = rerq.body;
  if( !params.mssv && !params.hoTen && !params.idTruong)
    res.status(400).json({msg: 'Thiếu thông tin'});

  Account.findOne({username: req.body.mssv})
    .then(result => {
      console.log('==find mssv: ', result)

      if(result)
        res.status(409).json({msg: 'Mã số sinh viên đã tồn tại!'})
      else {
        Profile.findOne({maThe: req.body.maThe})
         .then(result => {
           console.log('==find ma The: ', result)

           if(result)
             res.status(409).json({msg: 'Mã thẻ đã tồn tại!'})
           else {
             let accStudent = {
                username: req.body.mssv,
                password: md5(req.body.mssv),
                loai: "SV",
                isDelete: 0
              };
              var acc = new Account(accStudent);

              //----save account---------
              acc.save().then((result) => {
                let infoStudent = {
                  idTaiKhoan: result._id,
                  hoTen: req.body.hoTen,
                  MSSV: req.body.mssv,
                  idPhong: req.body.idPhong,
                  truong: req.body.idTruong,
                  maThe: req.body.maThe,
                  ngayVaoO: new Date() // <--MTrung
                };
                let student = new Profile(infoStudent);

                //------save profile-------
                student.save().then(result => {
                  console.log('==register student: success', result);
                  res.status(200).json(req.body);
                }).catch(err => {
                  console.log('==register student err: ', err);
                  res.status(500).json({msg: 'tạo profile err!'});
                })
               //--------end save profile----------
              }).catch(err => {
                console.log('==register account err: ', err);
               res.status(500).json({msg: 'tạo account err'});
             })
             //-----end catch save account-------
             Room.findOne({_id: req.body.idPhong})
               .then(result => {
                 result.soNguoi = result.soNguoi + 1
                 result.save()
               }).catch(err =>{
                 console.log('==phong err', err)
                res.status(500).json({msg: 'update phong err'});
             })
           }
           //----------end điều kiện mã thẻ tồn tại------------
         }).catch(err => {
          res.status(400).json({msg: 'truy vấn mã thẻ err'})
        })
        //----------end catch maThe------------
      }
      //----------end điều kiện mssv tồn tại-------------
    }).catch(err => {
    res.status(400).json({msg: 'truy vấn mã thẻ err!'})
  });
  //----------end catch mssv tồn tại----------------
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
          console.log('find success', result);
          res.status(200).json({msg: 'Bạn đã xóa thành công'})
        }).catch(err => {
        res.status(400).json({msg: 'Xóa thất bại'})
      })
    })
  }

}

exports.updateInfo = (req,res) => {
  const info = req.body.info;
  Profile.findOneAndUpdate({MSSV: info.MSSV},{ $set: info })
    .then(result => {
      console.log('==success', result)
      res.status(200).json({msg: 'Cập nhật thành công!'})
    }).catch(err => {
    console.log('==err', err)
      res.status(400).json({msg: 'cập nhật không thành công!'})
  })
};

exports.getListStudent = (req, res) => {
  let query = {};
  const params = req.body;
  if(params.hoTen)
    query.hoTen = { $regex: '.*' + params.hoTen + '.*', $options: 'i' };
  if(params.mssv)
    query.MSSV = { $regex: '.*' + params.mssv + '.*', $options: 'i' };

  if(params.idPhong)
    query.idPhong = params.idPhong;
  if(params.idTruong)
    query.truong = params.idTruong;
  if(!params.options)
    res.status(400).json({'msg': 'missing options'});
  //query = {...query, truong:{$nin: [null, '']}};
  //query.idTaiKhoan =  {isDelete: 0};
  console.log('==query', query);

  let options = params.options;
  options.populate = ['idTaiKhoan','idPhong', 'truong', 'nganhHoc'];

  console.log('==query', query);
  Account.find({isDelete: params.isOld, loai: 'SV'}).select('_id').then(accs => {
    var arr = [];
    accs.forEach(acc => {
      arr.push(acc._id)
    })
    query.idTaiKhoan = {$in : arr}
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

exports.getRoomHistory = (req, res) => {
  const id = req.params.id;
  RoomHistory.find({id: id}).sort({ ngayChuyen: -1 }).
    then(result => {
      res.status(200).json(result)
  }).catch(err =>
    res.status(400)
  )
}

exports.uploadImage = (req, res) => {
  console.log(req.body);
  res.json({
    rs: 'success',
  })
}
