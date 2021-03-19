const Image = require('../models/images');
const path = require('path');

exports.getIndex = function (req, res) {
    try {
        Image.find({},
            'title author desc',
            function (err, imgs) {
                if (err) {
                    res.status(500).send('Invalid data!');
                    return;
                }
                
                imgList = []
                for (img of imgs){
                    imgList.push({ 
                        id: img._id, 
                        title: img.title, 
                        author: img.author, 
                        desc: img.desc 
                    });
                }

                res.render('index', { title: "Home", imgList: imgList });
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}

exports.searchAuthor = function (req, res) {
    q = req.query.q
    try {
        Image.find({ author: q },
            'title author desc',
            function (err, imgs) {
                if (err) {
                    res.status(500).send('Invalid data!');
                    return;
                }
                
                imgList = []
                for (img of imgs){
                    imgList.push({ 
                        id: img._id, 
                        title: img.title, 
                        author: img.author, 
                        desc: img.desc 
                    });
                }
                
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ code: 0, data: { list: imgList } }));
            });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}