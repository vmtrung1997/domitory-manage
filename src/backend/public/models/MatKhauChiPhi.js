var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lichSuSchema = new Schema({
    password: {type: String, select: false}
});
const model = mongoose.model('MatKhauChiPhi', lichSuSchema, 'MatKhauChiPhi');
module.exports = model;