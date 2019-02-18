var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var thongBaoSchema = new Schema({
    tieuDe: String,
    noiDunng: String,
    ngayBD: Date,
    ngayKT: Date
});
const model = mongoose.model('Truong', thongBaoSchema, 'Truong');
module.exports = model;