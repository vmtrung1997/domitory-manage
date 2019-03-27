var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    path = require('path'),
    mongoose = require('mongoose'),
    cors = require('cors')

mongoose.connect('mongodb://admin:123abc@ds149875.mlab.com:49875/kytucxa', 
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors())
var verifyAccessToken = require('./public/repos/authRepo').verifyAccessToken;
var checkToken = require('./public/repos/authRepo').checkToken;

app.use('/api/user', require('./public/routes/user'));
app.use('/api/manager', verifyAccessToken, require('./public/routes/manager'));
app.use('/api/student', verifyAccessToken, require('./public/routes/student'));
app.use('/api/check_token', checkToken, require('./public/routes/token'));
app.use('/api/security', verifyAccessToken, require('./public/routes/security'));
app.use('/api/logout', require('./public/routes/logout'));

app.get('/', (_, res) => {
    res.json({
        msg: 'Hello from nodejs express api'
    })
});

app.use((req, res, next) => {
  res.sendStatus(404)
})

app.use((err, req, res, next) => {
  res.status(500)
  res.send(err)
})


module.exports = app
