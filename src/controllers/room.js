const Room = require('../models/rooms');
const path = require('path');

exports.getAll = function (req, res) {
    try {
        Room.find({},
            'imgId title author desc',
            function (err, rooms) {
                if (err) {
                    res.status(500).send('Invalid data!');
                    return;
                }
                
                res_list = []
                for (room of rooms){
                    res_list.push({ 
                        id: room._id, 
                        imgId: room.imgId, 
                        title: room.title, 
                        author: room.author, 
                        desc: room.desc 
                    });
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ code: 0, data: { list: res_list } }));
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}

exports.getOne = function (req, res) {
    id = path.basename(req.path)
    try {
        Room.find({ _id: id },
            'imgId title author desc',
            function (err, rooms) {
                if (err){
                    res.status(500).send('Invalid data!');
                    return;
                }
                
                res.setHeader('Content-Type', 'application/json');
                if (rooms.length > 0) {
                    let room = rooms[0];
                    res_data = {
                        id: room._id,
                        imgId: room.imgId,
                        title: room.title,
                        author: room.author,
                        desc: room.desc
                    };
                    res.send(JSON.stringify({ code: 0, data: res_data }));
                }
                else{
                    res.send(JSON.stringify({ code: -1, data: {}, message: "Not found" }));
                }
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}
