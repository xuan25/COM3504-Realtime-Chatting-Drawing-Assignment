var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('history', { title: 'History' });
});

module.exports = router;