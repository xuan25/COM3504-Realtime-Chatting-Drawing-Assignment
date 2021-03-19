var express = require('express');
var router = express.Router();

const joinCon = require('../controllers/join');

/* GET home page. */
router.get(/^\/[0-9a-z]+$/, joinCon.getJoinPage);

module.exports = router;
