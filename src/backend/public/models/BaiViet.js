var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var baiVietSchema = new Schema({
    idTaiKhoan: String,
    tieuDe: String,
    noiDung: String
});
const model = mongoose.model('BaiViet', baiVietSchema, 'BaiViet');
module.exports = model;