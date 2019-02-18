var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chiSoPhongSchema = new Schema({
    tenHD: String,
    ngay: Date,
    batBuoc: Boolean,
    diem: Number
});
const model = mongoose.model('ChiSoPhong', chiSoPhongSchema, 'ChiSoPhong');
module.exports = model;