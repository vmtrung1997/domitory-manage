var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var loaiPhongSchema = new Schema({
    loai: Numbber,
    ten: String,
    dien: Boolean, //true: co tinh tien dien
    nuoc: Boolean, //true: co tinh tien nuoc
    tienRac: Number
});
const model = mongoose.model('LoaiPhong', loaiPhongSchema, 'LoaiPhong');
module.exports = model;