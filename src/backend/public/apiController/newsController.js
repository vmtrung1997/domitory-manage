const BaiViet = require("../models/BaiViet");
require("../models/Profile");

exports.deleteNews = (req, res) => {
  BaiViet.deleteOne({ _id: req.body.id }, function(err) {
    if (!err) {
      res.status(202).json({ rs: "ok" });
      console.log("==delete_news: success");
    } else {
      console.log("==delete_news:  fail", err);
      res.status(500);
    }
  });
};

exports.getNews = (req, res) => {
  var skip = req.body.options.skip;
  var limit = req.body.options.limit;
  var query = {};

  if(req.body.options.query)
    query = { $text: { $search: req.body.options.query }}

  if(req.body.options.type !== -1)
    query.loai = req.body.options.type

  var totalPages = 1;
  BaiViet.countDocuments(query, (err, data) => {
    totalPages = parseInt(data) / limit;
  });

  BaiViet.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "Profile",
        localField: "idTaiKhoan",
        foreignField: "idTaiKhoan",
        as: "taikhoan"
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$taikhoan", 0] }, "$$ROOT"]
        }
      }
    },
    {
      $project: {
        taikhoan: 0,
        MSSV: 0,
        danToc: 0,
        diaChi: 0,
        email: 0,
        gioiTinh: 0,
        idPhong: 0,
        idTaiKhoan: 0,
        moTa: 0,
        nganhHoc: 0,
        ngaySinh: 0,
        ngayVaoO: 0,
        sdt: 0,
        sdtNguoiThan: 0,
        truong: 0
      }
    }
  ])
  .sort({ngayChinhSua: -1})
    .skip(skip)
    .limit(limit)
    
    .then(rs => {
      if (rs) {
        res.json({
          message: "succes",
          data: rs,
          totalPages: totalPages
        });
      } else {
        res.json({
          message: "fail",
          data: "no data"
        });
      }
    });
};

exports.updateNews = (req, res) => {
  var data = req.body.data;
  var date = new Date();

  BaiViet.update(
    { _id: data.id },
    {
      $set: {
        tieuDe: data.tieuDe,
        noiDung: data.noiDung,
        ngayChinhSua: date,
        trangThai: data.trangThai,
        ghim: data.ghim,
        loai: parseInt(data.loai)
      }
    }
  )
    .then(place => {
      console.log("==update-news: success");
      console.log(place);
      res.status(200).json({
        rs: "success"
      });
    })
    .catch(err => {
      if (err) {
        console.log("==update-news: fail");
        res.json({
          rs: "fail",
          msg: err
        });
      }
    });
};

exports.addNews = (req, res) => {
  try {
    var data = {
      ngayTao: req.body.data.dateCreated,
      tieuDe: req.body.data.title,
      idTaiKhoan: req.body.data.author,
      ngayChinhSua: new Date(),
      noiDung: req.body.data.content,
      trangThai: req.body.data.trangThai,
      loai: parseInt(req.body.data.loai),
      ghim: req.body.data.ghim
    };
    var register = new BaiViet(data);
    register
      .save()
      .then(() => {
        console.log("==insert: success");
        res.status(202).json({
          message: "ok"
        });
      })
      .catch(err => {
        console.log("==insert: ", err);
        res.status(500);
      });
  } catch (e) {
    console.log(e);
  }
};
