var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ketQuaHDSchema = new Schema({
    idHD: {type: Schema.Types.String, ref: 'HoatDong'},
    idSV: {type: Schema.Types.String, ref: 'Profile'},
    isDK: {type: Boolean},
    isTG: {type: Boolean},
});
const model = mongoose.model('KetQuaHD', ketQuaHDSchema, 'KetQuaHD');
module.exports = model;