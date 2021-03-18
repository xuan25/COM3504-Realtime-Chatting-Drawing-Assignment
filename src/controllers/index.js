const Room = require('../models/rooms');
const path = require('path');

exports.getIndex = function (req, res) {
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

exports.searchAuthor = function (req, res) {
    q = req.query.q
    try {
        
        Room.find({ author: q },
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
                
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ code: 0, data: { list: roomList } }));
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}