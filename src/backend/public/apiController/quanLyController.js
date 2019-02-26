var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.json({
        msg: 'from quan ly Controller'
    })
})

module.exports = router;