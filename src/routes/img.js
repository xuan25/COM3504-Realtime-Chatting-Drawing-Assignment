var express = require('express');
var router = express.Router();

const imgCon = require('../controllers/img');

router.get('/all', imgCon.getAll);
router.get(/^\/[0-9a-z]+$/, imgCon.getOne);
router.get(/^\/raw\/[0-9a-z]+$/, imgCon.getRaw);

module.exports = router;
