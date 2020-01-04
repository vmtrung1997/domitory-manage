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
const options = {
    autoIndex: false, // Don't build indexes
    reconnectTries: 30, // Retry up to 30 times
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    autoReconnect: true,
  }

const connectionURL = 'mongodb://db:27017/ktx'

const connectWithRetry = () => {
  console.log('MongoDB connection with retry')
  mongoose.connect(connectionURL, options).then(()=>{
    console.log('MongoDB is connected')
  }).catch(err=>{
    console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
    setTimeout(connectWithRetry, 5000)
  })
}

connectWithRetry()

require('./public/models/Phong')
require('./public/models/ChiPhiPhong')
mongoose.set('useCreateIndex', true);

var app = express();
global.appRoot = path.resolve(__dirname);

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
// for parsing multipart/form-data
app.use(upload.array());

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
