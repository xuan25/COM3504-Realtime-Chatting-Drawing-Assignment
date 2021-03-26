var express = require('express');
var router = express.Router();

const roomCon = require('../controllers/room');

// get room page for service worker
router.get('/offline', roomCon.getRoomPageOffline);

// get room page for a room
router.get('/:imgId/:roomId', roomCon.getRoomPage);

module.exports = router;
