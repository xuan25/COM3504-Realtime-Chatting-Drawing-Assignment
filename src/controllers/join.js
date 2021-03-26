const path = require('path');

exports.getJoinPage = function (req, res) {
    imgId = req.params.imgId
    roomId = req.query.roomId
    res.render('join', { title: "Join", imgId: imgId, roomId: roomId });
}

exports.getJoinPageOffline = function (req, res) {
    res.render('join', { title: "Join (Offline)" });
}

