var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
require('./Profile')
var Schema = mongoose.Schema;

var lichSuSchema = new Schema({
    MSSV: String,
    thoiGian: Date,
    type: Number, //0: vao, 1: ra
    createAt: { type: Date, expires: 3600*24*30 }
});
lichSuSchema.plugin(mongoosePaginate);
lichSuSchema.virtual('profile', {
  ref: 'Profile',
  localField: 'MSSV',
  foreignField: 'MSSV',
  justOne: true // for many-to-1 relationships
});
lichSuSchema.set('toObject', { virtuals: true });
lichSuSchema.set('toJSON', { virtuals: true });
const model = mongoose.model('LichSuRaVao', lichSuSchema, 'LichSuRaVao');
module.exports = model;