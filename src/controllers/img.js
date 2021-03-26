const Image = require('../models/images');
const path = require('path');

// get full data in json for all images
exports.getAll = function (req, res) {
    try {
        // find in mongoDB
        Image.find({},
            'title author desc data',
            function (err, imgs) {
                if (err){
                    res.status(500).send('Invalid data!');
                    return;
                }
                
                // read results
                res_list = []
                for (img of imgs){
                    res_list.push({ 
                        id: img._id, 
                        title: img.title,
                        author: img.author,
                        desc: img.desc,
                        data: img.data
                    });
                }

                // response
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ code: 0, data: { list: res_list } }));
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}

// get full data in json for an image
exports.getOne = function (req, res) {
    id = path.basename(req.path)
    try {
        // find in mongoDB
        Image.find({_id: id},
            'title author desc data',
            function (err, imgs) {
                if (err){
                    res.status(500).send('Invalid data!');
                    return;
                }
                
                // response
                res.setHeader('Content-Type', 'application/json');
                if (imgs.length > 0) {
                    let img = imgs[0];
                    res_data = {
                        id: img._id, 
                        title: img.title,
                        author: img.author,
                        desc: img.desc,
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

// get metadata in json for all images
exports.getAllMeta = function (req, res) {
    try {
        // find in mongoDB
        Image.find({},
            'title author desc',
            function (err, imgs) {
                if (err){
                    res.status(500).send('Invalid data!');
                    return;
                }
                
                // read results
                res_list = []
                for (img of imgs){
                    res_list.push({ 
                        id: img._id, 
                        title: img.title,
                        author: img.author,
                        desc: img.desc
                    });
                }

                // response
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ code: 0, data: { list: res_list } }));
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}

// get metadata in json for an image
exports.getOneMeta = function (req, res) {
    id = path.basename(req.path)
    try {
        // find in mongoDB
        Image.find({_id: id},
            'title author desc',
            function (err, imgs) {
                if (err){
                    res.status(500).send('Invalid data!');
                    return;
                }
                
                // response
                res.setHeader('Content-Type', 'application/json');
                if (imgs.length > 0) {
                    let img = imgs[0];
                    res_data = {
                        id: img._id, 
                        title: img.title,
                        author: img.author,
                        desc: img.desc
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

// get raw data for an image
exports.getOneRaw = function (req, res) {
    id = path.basename(req.path)
    try {
        // find in mongoDB
        Image.find({_id: id},
            'data',
            function (err, imgs) {
                if (err){
                    res.status(500).send('Invalid data!');
                    return;
                }
                
                if (imgs.length > 0) {
                    // parse data url
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
                    
                    // decode base64
                    const rawDataBuffer = Buffer.from(payload, encodeType);
                    
                    // response
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