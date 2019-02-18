var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lichSuSchema = new Schema({
    idSV: String,
    gioVao: Date
});
const model = mongoose.model('KetQuaHD', lichSuSchema, 'KetQuaHD');
module.exports = model;