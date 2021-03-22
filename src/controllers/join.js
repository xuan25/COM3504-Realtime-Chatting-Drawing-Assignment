const path = require('path');

exports.getJoinPage = function (req, res) {
    id = path.basename(req.path)
    res.render('join', { title: "Join", imgId: id });
}

exports.joinRoom = function (req, res) {
    roomId = path.basename(req.path)
    imgId = path.basename(path.dirname(req.path))
    res.render('room', { title: "Room", imgId: imgId, roomId: roomId });
}