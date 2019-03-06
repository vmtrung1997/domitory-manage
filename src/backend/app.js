var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    path = require('path'),
	mongoose = require('mongoose');

mongoose.connect('mongodb://admin:123abc@ds149875.mlab.com:49875/kytucxa', { useNewUrlParser: true })
mongoose.set('useCreateIndex', true);

var app = express();
global.appRoot = path.resolve(__dirname);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(bodyParser.json());

var verifyAccessToken = require('./public/repos/authRepo').verifyAccessToken;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api/user', require('./public/routes/user'));
app.use('/api/manager', verifyAccessToken, require('./public/routes/manager'));
app.use('/api/student', verifyAccessToken, require('./public/routes/student'));
app.use('/api/logout', verifyAccessToken, require('./public/routes/logout'));

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
