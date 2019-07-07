var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tonGiaoSchema = new Schema({
    tenTonGiao: String,
});
const model = mongoose.model('TonGiao', tonGiaoSchema, 'TonGiao');
module.exports = model;