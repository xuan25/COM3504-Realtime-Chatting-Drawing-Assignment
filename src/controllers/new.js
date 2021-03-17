const Image = require('../models/images');
const Room = require('../models/rooms');

exports.insert = function (req, res) {
    let userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        roomId = Math.round(Math.random() * 10000);
        let image = new Image({
            roomId: roomId,
            data: userData.img
        });
        let room = new Room({
            roomId: roomId,
            title: userData.title,
            author: userData.author,
            desc: userData.desc
        });
        console.log('received: ' + room);
        console.log('received: ' + image);

        image.save(function (err, results) {
            console.log(results._id);
            if (err){
                res.status(500).send('Invalid data!');
            }

            room.save(function (err, results) {
                console.log(results._id);
                if (err){
                    res.status(500).send('Invalid data!');
                }

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(results));
            });
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}
