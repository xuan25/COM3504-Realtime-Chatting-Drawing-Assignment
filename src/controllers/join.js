const path = require('path');

exports.getJoinPage = function (req, res) {
    imgId = req.params.imgId
    roomId = req.query.roomId
    res.render('join', { isTemplate: false, title: "Join", imgId: imgId, roomId: roomId });
}

exports.getJoinPageOffline = function (req, res) {
    res.render('join', { isTemplate: true, title: "Join (Offline)" });
}

