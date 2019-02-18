var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ketQuaHDSchema = new Schema({
    idHD: String,
    idSV: String
});
const model = mongoose.model('KetQuaHD', ketQuaHDSchema, 'KetQuaHD');
module.exports = model;