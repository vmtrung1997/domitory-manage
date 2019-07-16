var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var profileSchema = new Schema({
    idTaiKhoan: {type: Schema.Types.String, ref: 'TaiKhoan'},
    CMND: String,
    hoTen: String,
    ngaySinh: Date,
    gioiTinh: {type: Number, enum: [0,1]}, //1 nam 0 nu
    email: String,
    diaChi: String,
    sdt: String,
    MSSV: String,
    tonGiao: {type: Schema.Types.String,ref: 'TonGiao'},
    maThe: String,
    nganhHoc: {type: Schema.Types.String, ref: 'NganhHoc'},
    truong: {type: Schema.Types.String, ref: 'Truong'},
    idPhong: {type: Schema.Types.String, ref: 'Phong'},
    moTa: String,
    sdtNguoiThan: String,
    ngayVaoO: Date,
    nam: Number,
    ngayHetHan: Date,
    danToc: {type: Schema.Types.String,ref: 'DanToc'},
    dangVien:  {type: Number, enum: [0,1]}, //1 có 0 không,
    img:  String,
    isActive: Boolean,
    hanDangKy: Date,
    flag: Boolean
});
profileSchema.plugin(mongoosePaginate);
const model = mongoose.model('Profile', profileSchema, 'Profile');
module.exports = model;