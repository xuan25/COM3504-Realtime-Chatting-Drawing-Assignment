const path = require('path');

exports.getJoinPage = function (req, res) {
    imgId = path.basename(req.path)
    roomId = req.query.roomId
    res.render('join', { title: "Join", imgId: imgId, roomId: roomId });
}

exports.joinRoom = function (req, res) {
    roomId = path.basename(req.path)
    imgId = path.basename(path.dirname(req.path))
    res.render('room', { title: "Room", imgId: imgId, roomId: roomId });
}

