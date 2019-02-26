var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.json({
        msg: 'from sinh vien Controller'
    })
})

module.exports = router;