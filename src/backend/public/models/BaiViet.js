var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var baiVietSchema = new Schema({
    idTaiKhoan: {type: Schema.Types.String, ref: 'TaiKhoan'},
    tieuDe: String,
    noiDung: String,
    ngayTao: Date,
    ngayChinhSua: Date,
    trangThai: {type: Number, enum: [0,1]}, //1: public 0: private
});
const model = mongoose.model('BaiViet', baiVietSchema, 'BaiViet');
module.exports = model;