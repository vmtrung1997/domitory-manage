var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lichSuSchema = new Schema({
    idSV: {type: Schema.Types.String, ref: 'Profile'},
    thoiGian: Date
});
const model = mongoose.model('LichSu', lichSuSchema, 'LichSu');
module.exports = model;