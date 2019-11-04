const fs = require('fs')
exports.getLog = (req, res) => {
  console.log(req.body.time);
  var dateObj = new Date(req.body.time);
  
  var filedate = `${dateObj.getDate()}_${dateObj.getMonth() + 1}_${dateObj.getFullYear()}`;
  fs.readFile(`./public/logs/${filedate}`, (err, buf) => {
    let fstring = ''
    if (err) {
      fstring = '';
    } else {
      fstring = buf
    }
    res.json({
      rs: fstring
    })
  })
}