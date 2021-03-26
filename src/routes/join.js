var express = require('express');
var router = express.Router();

const joinCon = require('../controllers/join');

router.get('/offline', joinCon.getJoinPageOffline);
router.get('/:imgId', joinCon.getJoinPage);

module.exports = router;
