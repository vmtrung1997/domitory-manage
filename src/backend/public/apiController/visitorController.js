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
  try {
    BaiViet.find({trangThai: 1},(err,doc) => {
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
}