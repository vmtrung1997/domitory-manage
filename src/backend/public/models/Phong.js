var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var phongSchema = new Schema({
    tenPhong: String,
    lau: Number,
    soNguoiToiDa: Number,
    trangThai: {type: Number, enum: [0, 1]}, //0: Ngung su dung, 1: Dang su dung
    loaiPhong: {type: Schema.Types.String, ref: 'LoaiPhong'},
    // isHoDan: Number,
    moTa: String
});
const model = mongoose.model('Phong', phongSchema, 'Phong');
module.exports = model;