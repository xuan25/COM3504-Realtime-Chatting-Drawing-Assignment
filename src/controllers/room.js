const path = require('path');

exports.getRoomPage = function (req, res) {
    imgId = req.params.imgId
    roomId = req.params.roomId
    res.render('room', { title: "Room", imgId: imgId, roomId: roomId });
}

exports.getRoomPageOffline = function (req, res) {
    res.render('room', { title: "Room (Offline)" });
}

