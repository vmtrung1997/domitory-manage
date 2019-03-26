var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var hoatDongSchema = new Schema({
    ten: String,
    diaDiem: String,
    ngayBD: Date,
    gioBD: String,
   	ngayKT: Date,
    gioKT: String,
    batBuoc: Boolean,
    soLuong: Number,
    diem: Number,
    moTa: String
});
hoatDongSchema.plugin(mongoosePaginate);

const model = mongoose.model('HoatDong', hoatDongSchema, 'HoatDong');
module.exports = model;