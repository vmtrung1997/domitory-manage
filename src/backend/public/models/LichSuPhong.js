var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lichSuPhongSchema = new Schema({
  idTaiKhoan: {type: Schema.Types.String, ref: 'TaiKhoan'},
  idPhong: {type: Schema.Types.String, ref: 'Phong'},
  ngayChuyen: Date,
});
const model = mongoose.model('LichSuPhong', lichSuPhongSchema, 'LichSuPhong');
module.exports = model;