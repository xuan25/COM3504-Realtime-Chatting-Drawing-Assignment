var express = require('express');
var router = express.Router();

const newCon = require('../controllers/new');

/* GET home page. */
router.post('/', newCon.insert);

module.exports = router;
