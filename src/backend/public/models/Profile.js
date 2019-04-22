var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var profileSchema = new Schema({
    idTaiKhoan: {type: Schema.Types.String, ref: 'TaiKhoan'},
    CMND: Number,
    hoTen: String,
    ngaySinh: Date,
    gioiTinh: {type: Number, enum: [0,1]}, //1 nam 0 nu
    email: String,
    diaChi: String,
    sdt: String,
    MSSV: String,
    maThe: String,
    nganhHoc: {type: Schema.Types.String, ref: 'NganhHoc'},
    truong: {type: Schema.Types.String, ref: 'Truong'},
    idPhong: {type: Schema.Types.String, ref: 'Phong'},
    moTa: String,
    sdtNguoiThan: String,
    ngayVaoO: Date,
    ngayHetHan: Date,
    danToc: String,
    img:  { data: Buffer, contentType: String },
    CMND: String,
    diemHD: Number,
    expireAt: {type: Schema.Types.Date,default: Date.now(), expires: 3600},
});

profileSchema.plugin(mongoosePaginate);
const model = mongoose.model('Profile', profileSchema, 'Profile');
module.exports = model;