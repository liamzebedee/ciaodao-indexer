var router = require('express').Router();

router.get('/status', (req, res) => {
    res.json({ g: 200 }).send()
})

router.use('/spaces', require('./spaces'))
router.use('/users', require('./users'))

module.exports = router;
