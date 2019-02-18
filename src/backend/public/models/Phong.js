var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var phongSchema = new Schema({
    phong: String,
    lau: String,
    tien: Number
});
const model = mongoose.model('Phong', phongSchema, 'Phong');
module.exports = model;