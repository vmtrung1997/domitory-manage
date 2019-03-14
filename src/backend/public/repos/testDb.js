var sinhVien = require('../models/SinhVien');
var TaiKhoan = require('../models/TaiKhoan')
var ChiPhiPhong = require('../models/ChiPhiPhong')
exports.get_sinh_vien = (req, res) => {
        ChiPhiPhong.updateMany({},{
            $set: {
                'trangThai': 1
            }
        },(err,raw) => {
            if (raw){
                res.json({
                    st: 'success',
                    val: raw
                })
            }
        })
    }

    // exports.get_sinh_vien = (req, res) => {
    //     TaiKhoan.updateMany({},{
    //         $set: {
    //             'password': '81dc9bdb52d04dc20036dbd8313ed055'
    //         }
    //     },(err,raw) => {
    //         if (raw){
    //             res.json({
    //                 st: 'success',
    //                 val: raw
    //             })
    //         }
    //     })
    // }

// exports.get_sinh_vien = (req, res) => {
//     sinhVien.find().skip(5).then(value => {
//         console.log(value);
//         res.status(200).json({
//             result: value
//         })
//     })
// }