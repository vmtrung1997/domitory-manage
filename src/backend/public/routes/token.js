var router = require('express').Router();

router.get('/', (req, res) => {
	res.json({ token:'true' })
});
 
module.exports = router;
