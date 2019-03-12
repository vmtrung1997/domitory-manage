var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var baiVietSchema = new Schema({
    idTaiKhoan: {type: Schema.Types.String, ref: 'TaiKhoan'},
    tieuDe: String,
    noiDung: String,
    img: [String]
});
const model = mongoose.model('BaiViet', baiVietSchema, 'BaiViet');
module.exports = model;