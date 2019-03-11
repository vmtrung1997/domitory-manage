var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var thongSoSchema = new Schema({
    id: Number,
    moTa: String,
    giaTri: Number,
});
const model = mongoose.model('ThongSo', thongSoSchema, 'ThongSo');
module.exports = model;