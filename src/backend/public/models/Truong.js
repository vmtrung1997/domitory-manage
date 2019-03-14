var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var truongSchema = new Schema({
    tenTruong: String, 
});
const model = mongoose.model('Truong', truongSchema, 'Truong');
module.exports = model;