var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var danTocSchema = new Schema({
    tenDanToc: String,
});
const model = mongoose.model('DanToc', danTocSchema, 'DanToc');
module.exports = model;