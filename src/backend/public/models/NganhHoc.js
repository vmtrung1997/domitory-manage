var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nganhHocSchema = new Schema({
    tenNganh: String,
});
const model = mongoose.model('NganhHoc', nganhHocSchema, 'NganhHoc');
module.exports = model;