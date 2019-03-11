var sinhVien = require('../models/SinhVien');

exports.get_sinh_vien = (req, res) => {
    sinhVien.find().skip(5).then(value => {
        console.log(value);
        res.status(200).json({
            result: value
        })
    })
}