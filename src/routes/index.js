var express = require('express');
var router = express.Router();

const indexCon = require('../controllers/index');

/* GET home page. */
router.get('/', indexCon.getIndex);

module.exports = router;
