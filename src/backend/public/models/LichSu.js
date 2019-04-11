var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
require('../models/Profile')
var Schema = mongoose.Schema;

var lichSuSchema = new Schema({
    MSSV: String,
    thoiGian: Date,
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
const model = mongoose.model('LichSu', lichSuSchema, 'LichSu');
module.exports = model;