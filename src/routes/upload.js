var express = require('express');
var router = express.Router();

const uploadCon = require('../controllers/upload');

/* GET home page. */
router.get('/', uploadCon.getIndex);
router.post('/', uploadCon.upload);

module.exports = router;
