var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var chiSoHienTaiSchema = new Schema({
    idPhong: {type: Schema.Types.String, ref: 'Phong'},
    thang: Number,
    nam: Number,
    soDien: Number,
    soNuoc: Number
});

chiSoHienTaiSchema.plugin(mongoosePaginate);

const model = mongoose.model('ChiSoHienTai', chiSoHienTaiSchema, 'ChiSoHienTai');
module.exports = model;