var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var thongSoSchema = new Schema({
    id: Number,
    loaiChiPhi: String,
    giaTriDau: Number,
    giaTriCuoi: Number,
    donVi: String,
    moTa: String,
    giaTriThuc: Number,
});
const model = mongoose.model('ThongSo', thongSoSchema, 'ThongSo');
module.exports = model;