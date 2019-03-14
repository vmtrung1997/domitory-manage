var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nganhHocSchema = new Schema({
    tenNganh: String,
});
const model = mongoose.model('Nganh', nganhHocSchema, 'Nganh');
module.exports = model;