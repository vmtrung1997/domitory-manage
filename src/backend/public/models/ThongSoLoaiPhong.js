var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var thongSoLoaiPhongSchema = new Schema({
    idLoaiPhong: {type: Schema.Types.String, ref: 'LoaiPhong'},
    id: Number,
    loaiChiPhi: {type: Number, enum: [0, 1]}, // 0: dien, 1: nuoc
    giaTriDau: Number,
    giaTriCuoi: Number,
    donVi: String,
    moTa: String,
    giaTriThuc: Number,
});
const model = mongoose.model('ThongSoLoaiPhong', thongSoLoaiPhongSchema, 'ThongSoLoaiPhong');
module.exports = model;