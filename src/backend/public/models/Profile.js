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
    tonGiao: String,
    maThe: {type: String, unique: true, sparse: true},
    nganhHoc: {type: Schema.Types.String, ref: 'NganhHoc'},
    truong: {type: Schema.Types.String, ref: 'Truong'},
    idPhong: {type: Schema.Types.String, ref: 'Phong'},
    moTa: String,
    sdtNguoiThan: String,
    ngayVaoO: Date,
    nam: Number,
    ngayHetHan: Date,
    danToc: String,
    img:  String,
    //img:  String,//{ data: Buffer, contentType: String }
    //expireAt: {type: Schema.Types.Date,default: Date.now(), expireAfterSeconds: 15},
    flag: Boolean
});
profileSchema.plugin(mongoosePaginate);
// profileSchema.index('expireAt',{expireAfterSeconds: 15});
const model = mongoose.model('Profile', profileSchema, 'Profile');
module.exports = model;