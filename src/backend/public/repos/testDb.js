var TaiKhoan = require('../models/TaiKhoan')
var ChiPhiPhong = require('../models/ChiPhiPhong')
var Profile = require('../models/Profile')
var Phong = require('../models/Phong')
var ObjectId = require('mongoose').Types.ObjectId;
var ThongSoLoaiPhong = require('../models/ThongSoLoaiPhong')
var fs = require('fs')
var XLSX = require('xlsx')
require('../models/Profile')
require('../models/TaiKhoan')
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
require('fs');

function readFile(path) {
    var fileContent;

    return new Promise(function(resolve) {
        fileContent = fs.readFileSync(path, {encoding: 'utf8'});
        resolve(fileContent);
    });
}
function saveRoom(value){
	let phong = new Phong({
		_id: new ObjectId(value[0]),
		tenPhong: value[1],
		lau: parseInt(value[2]),
		soNguoi: parseInt(value[3]),
		soNguoiToiDa: parseInt(value[4]),
		trangThai: parseInt(value[5]),
		//isHoDan: parseInt(value[6]),
		loaiPhong: value[6]
		//moTa: value[7]
	})
	return new Promise((resolve, reject) => {
		phong.save().then(()=>resolve({rs: 'ok'})).catch(err => reject(err))
	})
}
exports.import_room = (req, res) => {
	readFile('./public/bin/hinhanhtostring/PhongObj1.csv').then(result => {
		var arr = result.split('\r\n')
		var arr_split = arr.map(value => {
			return value.split(',')
		})
		console.log(arr_split);
		var arr_promise =[]
		arr_split.forEach(value => {
			arr_promise.push(saveRoom(value))
		})
		Promise.all(arr_promise).then( () => {
			res.json({
				rs: 'ok'
			})
		}).catch(err => res.json({rs: 'fail'}))
	})
}
function saveDetailRoom(value){
	let phong = new ThongSoLoaiPhong({
		idLoaiPhong: value[0],
		id: parseInt(value[1]),						
		loaiChiPhi: parseInt(value[2]),
		giaTriDau: parseInt(value[3]),
		giaTriCuoi: parseInt(value[4]),
		donVi: value[5],
		moTa: value[6],
		giaTriThuc: value[7]
	})
	return new Promise((resolve, reject) => {
		phong.save().then(()=>resolve({rs: 'ok'})).catch(err => reject(err))
	})
}
exports.import_detail_room = (req, res) => {
	TaiKhoan.find({isDelete: 1}).select('_id').then(tks => {
		var arrTk = tks.map(v => {return v._id})
		TaiKhoan.deleteMany({isDelete: 1}).then(e => {
			Profile.deleteMany({idTaiKhoan: {$in: arrTk}}).then(f => {
				res.json({rs: 'success'});
			})
		})
	})
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

exports.test_idTaiKhoan = (req, res) => {
	TaiKhoan.findOne({_id: '5c8682fb87358f57fbcd966e'}).then(value => {
		res.json({
			rs: 'success',
			data: value
		})
	}).catch(err => {
		res.json({
			rs: 'fail',
			msg: err
		})
	})
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