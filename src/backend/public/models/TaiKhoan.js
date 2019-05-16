var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var taiKhoanSchema = new Schema({
    idProfile: {type: Schema.Types.String, ref: 'Profile'},
    username: {type: String, unique: true},
    password: { type: String , select: false},
    loai: {type: String, enum: ['SA', 'AM', 'SV', 'BV']},
    isDelete: {type: Number, enum: [0, 1], select: false}
});
taiKhoanSchema.virtual('phanQuyen', {
  ref: 'PhanQuyen',
  localField: 'loai',
  foreignField: 'loai',
  justOne: true // for many-to-1 relationships
});
taiKhoanSchema.set('toObject', { virtuals: true });
taiKhoanSchema.set('toJSON', { virtuals: true });

taiKhoanSchema.index({username: 'text'});
taiKhoanSchema.plugin(mongoosePaginate);

const model = mongoose.model('TaiKhoan', taiKhoanSchema, 'TaiKhoan');
module.exports = model;