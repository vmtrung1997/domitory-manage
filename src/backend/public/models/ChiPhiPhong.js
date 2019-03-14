var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var chiPhiPhongSchema = new Schema({
    idPhong: {type: Schema.Types.String, ref: 'Phong'},
    thang: Number,
    nam: Number,
    soDien: Number,
    soNuoc: Number,
    soDienCu: Number,
    soNuocCu: Number,
    tienDien: Number,
    tienNuoc: Number,
    tienRac: Number,
    tongTien: Number,
    tongTienChu: String,
    trangThai: {type: Number, enum: [0, 1]}
});

chiPhiPhongSchema.plugin(mongoosePaginate);

const model = mongoose.model('ChiPhiPhong', chiPhiPhongSchema, 'ChiPhiPhong');
module.exports = model;


// const model = mongoose.model('ChiPhiPhong', chiPhiPhongSchema, 'ChiPhiPhong');
// module.exports = function(conection)
// { 
//   var mongoose = require('mongoose');
//   var mongoosePaginate = require('mongoose-paginate-v2');
//   var Schema = mongoose.Schema;

//   var chiPhiPhongSchema = new Schema({
//       idPhong: {type: Schema.Types.ObjectId, ref: 'Phong'},
//       thang: Number,
//       nam: Number,
//       soDien: Number,
//       soNuoc: Number,
//       soDienCu: Number,
//       soNuocCu: Number,
//       tienDien: Number,
//       tienNuoc: Number,
//       tienRac: Number,
//       tongTien: Number,
//       tongTienChu: Number,
//       trangThai: {type: String, enum: ['0', '1']}
//   });

//   chiPhiPhongSchema.plugin(mongoosePaginate);

//   return conection.model('ChiPhiPhong', chiPhiPhongSchema, 'ChiPhiPhong')

// };