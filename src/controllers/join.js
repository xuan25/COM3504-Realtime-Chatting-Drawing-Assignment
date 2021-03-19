const path = require('path');

exports.getJoinPage = function (req, res) {
    id = path.basename(req.path)
    res.render('join', { title: "Join", imgId: id });
}