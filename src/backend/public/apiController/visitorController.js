const BaiViet = require("../models/BaiViet");
const ObjectId = require("mongoose").Types.ObjectId;
exports.getDetailNews = (req, res) => {

  try {
    BaiViet.findOne({ _id: req.query.id }, (err,doc) => {
        if(err){
            res.status(204).json({
                message: "oke",
                data: err
              });
        }
        if(doc){
            res.status(200).json({
                 message: "oke",
                data: doc
              });
        }
    })
  } catch (err) {
    console.log(err);
    res.status(204).json({
      message: "oke",
      data: err
    });
  }
};

exports.getNews = (req,res) =>{
  var date = req.body.data;
  try {
    BaiViet.find({trangThai: 1,ngayTao: {$gt: date} },(err,doc) => {
        if(err){
            res.status(204).json({
                message: "oke",
                data: err
              });
        }
        if(doc){
            res.status(200).json({
                 message: "oke",
                data: doc
              });
        }
    }).limit(6)
  } catch (err) {
    console.log(err);
    res.status(204).json({
      message: "oke",
      data: err
    });
  }
}