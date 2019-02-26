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

app.use('/api/user', require('./public/apiController/taiKhoanController'));
app.use('/api/manager', verifyAccessToken, require('./public/apiController/quanLyController'));
app.use('/api/student', verifyAccessToken, require('./public/apiController/sinhVienController'));
app.use('/api/logout', verifyAccessToken, require('./public/apiController/logOutController'));

app.get('/', (_, res) => {
    res.json({
        msg: 'Hello from nodejs express api'
    })
});

var port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server runing on port ${port}`);
})