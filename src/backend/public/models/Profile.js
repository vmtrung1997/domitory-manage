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
    tonGiao: String,
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
<<<<<<< HEAD
    flag: Boolean
=======
    expireAt: {type: Schema.Types.Date,default: Date.now(), expires: 3600},
>>>>>>> a2bda447c9e066380e40c3f28b54a526b2cdd2b1
});

profileSchema.plugin(mongoosePaginate);
const model = mongoose.model('Profile', profileSchema, 'Profile');
module.exports = model;