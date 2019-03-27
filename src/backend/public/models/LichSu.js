var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lichSuSchema = new Schema({
    MSSV: String,
    thoiGian: Date
});
const model = mongoose.model('LichSu', lichSuSchema, 'LichSu');
module.exports = model;