var express = require('express');
var router = express.Router();

const joinCon = require('../controllers/join');

/* GET home page. */
router.get('/:imgId', joinCon.getJoinPage);
router.get('/:imgId/:roomId', joinCon.joinRoom);

module.exports = router;
