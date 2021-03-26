var express = require('express');
var router = express.Router();

const uploadCon = require('../controllers/upload');

// get upload page
router.get('/', uploadCon.getIndex);

// upload ajax api
router.post('/', uploadCon.upload);

module.exports = router;
