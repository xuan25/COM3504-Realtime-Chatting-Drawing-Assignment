var express = require('express');
var router = express.Router();

const imgCon = require('../controllers/img');

/* GET home page. */
router.get('/', imgCon.getData);

module.exports = router;
