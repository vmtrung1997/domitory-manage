var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taiKhoanSchema = new Schema({
    username: {type: String, unique: true},
    password: { type: String, select: false },
    loai: {type: String, enum: ['SA', 'AM', 'SV', 'BV']},
    isDelete: {type: Number, enum: [0, 1], select: false}
});

const model = mongoose.model('TaiKhoan', taiKhoanSchema, 'TaiKhoan');
module.exports = model;