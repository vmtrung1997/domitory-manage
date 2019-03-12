var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var sinhVienSchema = new Schema({
    idTaiKhoan: {type: Schema.Types.String, ref: 'TaiKhoan'},
    MSSV: String,
    maThe: String,
    nganh: {type: Schema.Types.String, ref: 'Nganh'},
    truong: String,
    phong: {type: Schema.Types.String, ref: 'Phong'},
    moTa: String,
    trangThai: String,
    sdtNguoiThan: String,
    ngayVaoO: Date,
    ngayHetHan: Date,
    danToc: String
});
sinhVienSchema.plugin(mongoosePaginate);

const model = mongoose.model('SinhVien', sinhVienSchema, 'SinhVien');
module.exports = model;