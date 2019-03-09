var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chiSoPhongSchema = new Schema({
    phong: String,
    dien: Number,
    nuoc: Number,
    thang: Number,
    nam: Number, 
    status: {type: String, enum: ['0', '1']}
});
const model = mongoose.model('ChiSoPhong', chiSoPhongSchema, 'ChiSoPhong');
module.exports = model;