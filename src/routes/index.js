var express = require('express');
var router = express.Router();

const indexCon = require('../controllers/index');

// home page
router.get('/', indexCon.getIndex);

// search ajax api
router.get('/search', indexCon.searchAuthor);

module.exports = router;
