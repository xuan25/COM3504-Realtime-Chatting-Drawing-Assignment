var express = require('express');
var router = express.Router();

const imgCon = require('../controllers/img');

router.get('/all', imgCon.getAll);
router.get('/meta', imgCon.getAllMeta);
router.get(/^\/[0-9a-z]+$/, imgCon.getOne);
router.get(/^\/meta\/[0-9a-z]+$/, imgCon.getOneMeta);
router.get(/^\/raw\/[0-9a-z]+$/, imgCon.getOneRaw);

module.exports = router;
