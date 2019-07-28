var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    path = require('path'),
    mongoose = require('mongoose'),
    cors = require('cors')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var { background } = require('./background')
//mongodb://admin:123abc@ds227168.mlab.com:27168/ktxtranhungdao
mongoose.connect('mongodb://127.0.0.1:27017/ktx',//mongodb://127.0.0.1:27017/ktx',
{ 
  useNewUrlParser: true,
  autoReconnect:true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
})

require('./public/models/Phong')
require('./public/models/ChiPhiPhong')
mongoose.set('useCreateIndex', true);

var app = express();
global.appRoot = path.resolve(__dirname);

app.use(morgan('tiny'));
app.use(cors());
// for parsing multipart/form-data
app.use(upload.array()); 
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
var { verifyAccessToken, verifyAdmin, verifySecurity } = require('./public/repos/authRepo');

app.use('/api/news',require('./public/routes/visitor'));
app.use('/api/user', require('./public/routes/user'));
app.use('/api/manager', verifyAccessToken, verifyAdmin, require('./public/routes/manager'));
app.use('/api/student', verifyAccessToken, require('./public/routes/student'));
app.use('/api/security', verifyAccessToken, verifySecurity, require('./public/routes/security'));
app.use('/api/logout', require('./public/routes/logout'));

app.get('/', (_, res) => {
    res.json({
        msg: 'Hello from nodejs express api'
    })
});

app.use((req, res, next) => {
  res.sendStatus(404)
})

setInterval(background, 1000*3600*24);

setInterval(require('./backup').dbAutoBackUp, 1000*3600*24);

app.use((err, req, res, next) => {
  res.status(500)
  res.send(err)
})

module.exports = app
