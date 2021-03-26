var express = require('express');
var router = express.Router();

const joinCon = require('../controllers/join');

// get join page for service worker
router.get('/offline', joinCon.getJoinPageOffline);

// get join page for a image
router.get('/:imgId', joinCon.getJoinPage);

module.exports = router;
