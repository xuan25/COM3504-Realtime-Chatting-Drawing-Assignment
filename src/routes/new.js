var express = require('express');
var router = express.Router();

const newCon = require('../controllers/new');

/* Create new room */
router.post('/', newCon.newUpload);

module.exports = router;
