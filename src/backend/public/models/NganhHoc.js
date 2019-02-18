var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nghanhHocSchema = new Schema({
    tenNghanh: String,
});
const model = mongoose.model('NghanhHoc', nghanhHocSchema, 'NghanhHoc');
module.exports = model;