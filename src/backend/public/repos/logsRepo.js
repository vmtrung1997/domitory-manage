const fs = require('fs')
const jwt_decode = require('jwt-decode')

function dataFile(datetime, user, title, data) {
  var stringFile = '';
  stringFile = stringFile + `\n*\tThời gian: ${datetime.toLocaleTimeString()} ${datetime.toLocaleDateString()}`
  stringFile = stringFile + `\n*\tNgười dùng: ${user}`;
  stringFile = stringFile + `\n*\tNội dung: ${title}`;
  if (Array.isArray(data)) {
    stringFile = stringFile + `\n*\tDữ liệu:`;
    data.forEach(v => {
      stringFile = stringFile + `\n*\t      ${JSON.stringify(v)}`;
    })
  } else
    stringFile = stringFile + `\n*\tData: \n*\t      ${JSON.stringify(data)}`
  stringFile = stringFile + `\n`
  return stringFile
}
exports.logs_database = async (accessToken, title, data) => {
  var date = new Date();
  var filedate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

  const decode = jwt_decode(accessToken)
  const user = decode.user.userEntity.username

  await fs.readFile(`./public/logs/${filedate}`, (err, buf) => {
    let fstring = ''
    if (err) {
      fstring = dataFile(date, user, title, data)
    } else {
      fstring = buf + dataFile(date, user, title, data)
    }
    console.log(fstring);
    fs.writeFile(`./public/logs/${filedate}`, fstring, (err) => {
      if (err) console.log(err);
      return;
    });
  })
}