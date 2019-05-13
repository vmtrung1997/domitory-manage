var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var phongSchema = new Schema({
    loai: String,
    quyen: [String]
});
const model = mongoose.model('PhanQuyen', phongSchema, 'PhanQuyen');
module.exports = model;