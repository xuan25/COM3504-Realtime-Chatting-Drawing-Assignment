var express = require('express');
var router = express.Router();

const imgCon = require('../controllers/img');

// get full data in json for all images
router.get('/all', imgCon.getAll);

// get metadata in json for all images
router.get('/meta', imgCon.getAllMeta);

// get full data in json for an image
// /<imgId>
router.get(/^\/[0-9a-z]+\/?$/, imgCon.getOne);

// get metadata in json for an image
// /meta/<imgId>
router.get(/^\/meta\/[0-9a-z]+\/?$/, imgCon.getOneMeta);

// get raw data for an image
// /raw/<imgId>
router.get(/^\/raw\/[0-9a-z]+\/?$/, imgCon.getOneRaw);

module.exports = router;
