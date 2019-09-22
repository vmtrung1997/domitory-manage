var router = require('express').Router();
var security = require('../apiController/securityController')

router.post('/get_history_list', security.get_history_list);

router.post('/input_card', security.input_card)
module.exports = router;