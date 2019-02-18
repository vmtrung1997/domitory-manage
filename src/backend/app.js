var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');

var app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());

app.get('/', (_, res) => {
    res.json({
        msg: 'hello from nodejs express api'
    })
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server runing on port ${port}`);
})