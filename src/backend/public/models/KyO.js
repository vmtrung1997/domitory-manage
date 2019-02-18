var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var kyOSchema = new Schema({
    idSV: String,
    namHoc: String,
    kyHoc: String
});
const model = mongoose.model('KyO', kyOSchema, 'KyO');
module.exports = model;