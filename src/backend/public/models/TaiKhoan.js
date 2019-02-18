var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taiKhoanSchema = new Schema({
    username: {type: String, unique: true},
    password: { type: String, select: false },
    hoTen: String,
    ngaySinh: Date,
    gioiTinh: Number,
    email: String,
    diaChi: String,
    sdt: String,
    loai: {type: String, enum: ['SA', 'AM', 'SV', 'BV']},
});
const model = mongoose.model('TaiKhoan', taiKhoanSchema, 'TaiKhoan');
module.exports = model;