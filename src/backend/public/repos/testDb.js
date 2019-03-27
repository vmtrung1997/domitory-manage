var sinhVien = require('../models/SinhVien');
var TaiKhoan = require('../models/TaiKhoan')
var ChiPhiPhong = require('../models/ChiPhiPhong')
var Profile = require('../models/Profile')
var ObjectId = require('mongoose').Types.ObjectId;
var fs = require('fs')
var XLSX = require('xlsx')
function updateProfile(object) {
	return new Promise((resolve, reject) => {
		//console.log(object);
		if (!object) {
			console.log('object false')
		}
		Profile.updateOne({ _id: object._id }, object, (err) => {
			if (err)
				reject(err)
			else
				resolve({ success: 'true' });
		})
	})
}
exports.update_image = (req, res) => {
	fs.readdir('./public/bin/hinhanhtostring', function (err, filenames) {
		if (err) {
			console.log(err);
		}
		else {
			Profile.find({}, {}, { learn: true }).then(profiles => {
				var profileArr = filenames.map(fn => {
					fn = fn.replace('.jpg', '');
					pf = profiles.find(p => p.MSSV === fn);
					//console.log('type object', typeof pf)
					if (pf) {
						pf.img.data = fs.readFileSync('./public/bin/hinhanhtostring/' + fn + '.jpg');
						pf.img.contentType = 'image/jpg';
						return pf;
					} else {
						return undefined
					}
				})
				profileArr = profileArr.filter(p => p !== undefined)
				var promiseProfile = []
				//var testpromiseProfile = profileArr.slice(0,5);
				profileArr.forEach(pr => {
					promiseProfile.push(updateProfile(pr));
				})

				Promise.all(promiseProfile).then(value => {
					res.json({
						rs: 'success',
						data: value
					})
				}).catch(err => {
					res.status(400).json({
						rs: 'fail',
						mes: err
					})
				})
			})
		}
	})
}
function process_RS(stream/*:ReadStream*/, cb/*:(wb:Workbook)=>void*/)/*:void*/{
  var buffers = [];
  stream.on('data', function(data) { buffers.push(data); });
  stream.on('end', function() {
    var buffer = Buffer.concat(buffers);
    var workbook = XLSX.read(buffer, {type:"buffer"});
 
    /* DO SOMETHING WITH workbook IN THE CALLBACK */
    cb(workbook);
  });
}

exports.uploadExcelFile = (req, res) => {
	var fileArr = req.body.file;
	var workbook = XLSX.read(fileArr, {type: 'binary'})
	var sheet_name_list = workbook.SheetNames;
	sheet_name_list.forEach(function(y) {
				var worksheet = workbook.Sheets[y];
				//console.log(worksheet)
				var headers = {};
				var data = [];
				for(z in worksheet) {
						if(z[0] === '!') continue;
						//parse out the column, row, and value
						var tt = 0;
						for (var i = 0; i < z.length; i++) {
								if (!isNaN(z[i])) {
										tt = i;
										break;
								}
						};
						var col = z.substring(0,tt);
						var row = parseInt(z.substring(tt));
						var value = worksheet[z].v;
	
						//store header names
						if(row == 1 && value) {
								headers[col] = value;
								continue;
						}
	
						if(!data[row]) data[row]={};
						data[row][headers[col]] = value;
				}
				console.log(headers)
				console.log(data);
		});
	res.json({rs:'success'})
}
    // exports.update_password = (req, res) => {
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