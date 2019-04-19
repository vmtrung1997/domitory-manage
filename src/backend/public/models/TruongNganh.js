var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var truongSchema = new Schema({
    idTruong: {type: Schema.Types.String, ref: 'Truong'},
    idNganhHoc: {type: Schema.Types.String, ref: 'NganhHoc'} 
});
const model = mongoose.model('TruongNganh', truongSchema, 'TruongNganh');
module.exports = model;