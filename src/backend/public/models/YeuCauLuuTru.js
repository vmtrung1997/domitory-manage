var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var YeuCauLuuTruSchema = new Schema({
    idProfile: {type: Schema.Types.String, ref: 'Profile'},	
    des: {type: String},
    type: {type: String}, // sinh viên thuộc diện
    date: {type: Date},
    isAccept: {type: Boolean}
});
baiVietSchema.plugin(mongoosePaginate);

const model = mongoose.model('YeuCauLuuTru', YeuCauLuuTruSchema, 'YeuCauLuuTru');
module.exports = model;
