var express = require('express');
var router = express.Router();

const roomCon = require('../controllers/room');

router.get('/all', roomCon.getAll);
router.get(/^\/[0-9a-z]+$/, roomCon.getOne);

module.exports = router;
