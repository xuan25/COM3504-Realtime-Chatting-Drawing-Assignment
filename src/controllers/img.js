const Image = require('../models/images');
const path = require('path');

exports.getAll = function (req, res) {
    try {
        Image.find({},
            'data',
            function (err, imgs) {
                if (err){
                    res.status(500).send('Invalid data!');
                    return;
                }
                
                res_list = []
                for (img of imgs){
                    res_list.push({ 
                        id: img._id, 
                        data: img.data
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
        Image.find({_id: id},
            'data',
            function (err, imgs) {
                if (err){
                    res.status(500).send('Invalid data!');
                    return;
                }
                
                res.setHeader('Content-Type', 'application/json');
                if (imgs.length > 0) {
                    let img = imgs[0];
                    res_data = {
                        id: img._id,
                        data: img.data
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

exports.getRaw = function (req, res) {
    id = path.basename(req.path)
    try {
        Image.find({_id: id},
            'data',
            function (err, imgs) {
                if (err){
                    res.status(500).send('Invalid data!');
                    return;
                }
                
                if (imgs.length > 0) {
                    let img = imgs[0];
                    imgDataUrl = img.data

                    headerPayload = imgDataUrl.split(",")
                    header = headerPayload[0]
                    payload = headerPayload[1]

                    protocolType = header.split(":")
                    protocol = protocolType[0]
                    type = protocolType[1]

                    rawTypeEncodeType = type.split(";")
                    rawType = rawTypeEncodeType[0]
                    encodeType = rawTypeEncodeType[1]


                    const rawDataBuffer = Buffer.from(payload, encodeType);

                    res.setHeader('Content-Type', rawType);
                    res.setHeader('Content-Length', rawDataBuffer.length);
                    
                    res.send(rawDataBuffer);
                }
                else{
                    res.status(404);
                }
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}