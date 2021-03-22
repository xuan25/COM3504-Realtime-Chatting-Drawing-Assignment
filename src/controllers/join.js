const path = require('path');

exports.getJoinPage = function (req, res) {
    imgId = req.params.imgId
    roomId = req.query.roomId
    res.render('join', { title: "Join", imgId: imgId, roomId: roomId });
}

exports.joinRoom = function (req, res) {
    imgId = req.params.imgId
    roomId = req.params.roomId
    res.render('room', { title: "Room", imgId: imgId, roomId: roomId });
}

