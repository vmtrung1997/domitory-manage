var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sinhVienSchema = new Schema({
    id: {type: String},
    maThe: String,
    nganhHoc: String,
    truong: String,
    trangThai: String,
    sdtNguoiThan: String,
    ngayVaoO: Date,
    ngayHetHan: Date,
    danToc: String
});
const model = mongoose.model('SinhVien', sinhVienSchema, 'SinhVien');
module.exports = model;