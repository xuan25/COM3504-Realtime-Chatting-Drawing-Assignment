
const path = require('path');

// get join page for a image
exports.getJoinPage = function (req, res) {
    imgId = req.params.imgId
    roomId = req.query.roomId
    res.render('join', { isTemplate: false, title: "Join", imgId: imgId, roomId: roomId });
}


// get join page for service worker
exports.getJoinPageOffline = function (req, res) {
    res.render('join', { isTemplate: true, title: "Join (Offline)" });
}

