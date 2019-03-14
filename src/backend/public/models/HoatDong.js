var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var hoatDongSchema = new Schema({
    ten: String,
    diaDiem: String,
    ngay: Date,
    batBuoc: Boolean,
    soLuong: Number,
    diem: Number,
    moTa: String
});
hoatDongSchema.plugin(mongoosePaginate);

const model = mongoose.model('HoatDong', hoatDongSchema, 'HoatDong');
module.exports = model;