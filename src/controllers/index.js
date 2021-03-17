const Room = require('../models/rooms');
const path = require('path');

exports.getIndex = function (req, res) {
    id = parseInt(req.query.id)
    try {
        Room.find({},
            'imgId title author desc',
            function (err, rooms) {
                if (err) {
                    res.status(500).send('Invalid data!');
                    return;
                }
                
                roomList = []
                for (room of rooms){
                    roomList.push({ 
                        id: room._id, 
                        imgId: room.imgId, 
                        title: room.title, 
                        author: room.author, 
                        desc: room.desc 
                    });
                }

                res.render('index', { title: "Home", roomList: roomList });
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}