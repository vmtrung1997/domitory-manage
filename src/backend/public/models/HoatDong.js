var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hoatDongSchema = new Schema({
    tenHD: String,
    ngay: Date,
    batBuoc: Boolean,
    diem: Number
});
const model = mongoose.model('HoatDong', hoatDongSchema, 'HoatDong');
module.exports = model;