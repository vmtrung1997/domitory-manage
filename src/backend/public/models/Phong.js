var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var phongSchema = new Schema({
    tenPhong: String,
    lau: Number,
    soNguoi: Number,
    soNguoiToiDa: Number,
    trangThai: String,
    isHoDan: Number,
    moTa: String
});
const model = mongoose.model('Phong', phongSchema, 'Phong');
module.exports = model;