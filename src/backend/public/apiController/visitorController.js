const BaiViet = require("../models/BaiViet");
const ObjectId = require("mongoose").Types.ObjectId;
exports.getNews = (req, res) => {
  console.log(req.query.id);
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
