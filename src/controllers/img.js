const Image = require('../models/images');

exports.getData = function (req, res) {
    roomId = parseInt(req.query.roomId)
    try {
        Image.find({roomId: roomId},
            'data',
            function (err, images) {
                if (err)
                    res.status(500).send('Invalid data!');

                let image = null;
                if (images.length > 0) {
                    let firstElem = images[0];
                    image = {
                        data: firstElem.data
                    };
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(image));
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}