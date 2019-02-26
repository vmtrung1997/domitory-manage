const mongoose = require("mongoose");
const Schema = mongoose.Schema;
    ObjectId    = Schema.ObjectId;
const token = new Schema({
    userid: String,
    token: String,
    exp: Date,
});
// tao module 
const rftoken = mongoose.model("RefreshToken",token,"RefreshToken");
module.exports=rftoken;