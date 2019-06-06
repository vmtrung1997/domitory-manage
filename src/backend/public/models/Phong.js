var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var phongSchema = new Schema({
    tenPhong: String,
    lau: Number,
    soNguoiToiDa: Number,
    loaiPhong: {type: Schema.Types.String, ref: 'LoaiPhong'},
    gioiTinh: {type: Number, enum: [0,1]},
    moTa: String
});
const model = mongoose.model('Phong', phongSchema, 'Phong');
module.exports = model;