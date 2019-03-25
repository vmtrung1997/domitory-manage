const BaiViet = require('../models/BaiViet');

require('../models/Profile')


exports.addNews=(req,res)=>{
    console.log(req.body.data);
    try {
        var data = {
            ngayTao: req.body.data.dateCreated,
            tieuDe: req.body.data.user,
            idTaiKhoan: req.body.data.author,
            noiDung: req.body.data.content,
            status: 1
        }
        var register = new BaiViet(data);
        register.save().then(() => {
            console.log('==insert: success')
            res.status(201).json({
                message: 'ok'
            })
        }).catch(err => {
            console.log('==insert: ', err);
            res.status(500);
        })
    } catch (e) {
        console.log(e);
    }
}