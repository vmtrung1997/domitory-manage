var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chiSoPhongSchema = new Schema({
    phong: String,
    dien: Number,
    nuoc: Number,
    thangNam: Date
});
const model = mongoose.model('ChiSoPhong', chiSoPhongSchema, 'ChiSoPhong');
module.exports = model;