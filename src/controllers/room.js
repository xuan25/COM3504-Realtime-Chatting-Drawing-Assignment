
const path = require('path');

// get room page for a room
exports.getRoomPage = function (req, res) {
    imgId = req.params.imgId
    roomId = req.params.roomId
    res.render('room', { isTemplate: false, title: "Room", imgId: imgId, roomId: roomId });
}


// get room page for service worker
exports.getRoomPageOffline = function (req, res) {
    res.render('room', { isTemplate: true, title: "Room (Offline)" });
}

