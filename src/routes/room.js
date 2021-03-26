var express = require('express');
var router = express.Router();

const roomCon = require('../controllers/room');

router.get('/offline', roomCon.getRoomPageOffline);
router.get('/:imgId/:roomId', roomCon.getRoomPage);

module.exports = router;
