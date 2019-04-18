var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var baiVietSchema = new Schema({
    idTaiKhoan: {type: Schema.Types.String, ref: 'TaiKhoan'},
    tieuDe: String,
    noiDung: String,
    ngayTao: Date,
    ngayChinhSua: Date,
    trangThai: {type: Number, enum: [0,1]}, //1: public 0: private,
    loai: String,
    ghim: {type: Number, enum: [0,1]}, //1: có 0: không,
});
baiVietSchema.index({tieuDe: 'text'});
baiVietSchema.plugin(mongoosePaginate);

const model = mongoose.model('BaiViet', baiVietSchema, 'BaiViet');
module.exports = model;
