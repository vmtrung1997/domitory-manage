const BaiViet = require("../models/BaiViet");
const ObjectId = require("mongoose").Types.ObjectId;
exports.getDetailNews = (req, res) => {
  try {
    BaiViet.findOne({ _id: req.query.id }, (err, doc) => {
      if (err) {
        res.status(204).json({
          message: "oke",
          data: err
        });
      }
      if (doc) {
        res.status(200).json({
          message: "oke",
          data: doc
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      message: "oke",
      data: err
    });
  }
};

exports.getPinNews = (req, res) => {
  try {
    BaiViet.find({ ghim: 1, trangThai: 1}, (err, doc) => {
      if (doc.length === 0) {
        res.status(204).json({
          message: "oke",
          data: err
        });
      } else {
        res.status(200).json({
          message: "oke",
          data: doc
        });
      }
    })
      .limit(4)
      .sort({ ngayTao: -1 });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      message: "oke",
      data: err
    });
  }
};

exports.getNews = (req, res) => {
  var date = req.body.data;
  console.log(req.body);
  var skip =  parseInt(req.body.skip);
  var limit = req.body.limit


  try {
    BaiViet.find({ trangThai: 1,ghim: 0})
      .sort({ ngayTao: -1 })
      .skip(skip)
      .limit(limit)
      .then(rs => {
   
        if (rs.length === 0) {
          res.status(204).json({
            message: "fail"
          });
        } else {
          res.status(200).json({
            message: "oke",
            data: rs
          });
        }
      });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      message: "error",
      data: err
    });
  }
};
