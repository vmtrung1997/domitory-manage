var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');
    path = require('path');
	mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/KTX', { useNewUrlParser: true })

var app = express();
global.appRoot = path.resolve(__dirname)

app.use(bodyParser.urlencoded({ extended: true }))

app.use(morgan('tiny'));
app.use(bodyParser.json());

app.get('/', (_, res) => {
    res.json({
        msg: 'hello from nodejs express api'
    })
});


module.exports = app