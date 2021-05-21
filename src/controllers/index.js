const Image = require('../models/images');
const path = require('path');

// home page
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

// search ajax api
exports.searchAuthor = function (req, res) {
  q = req.query.q
  try {
    // find in mongoDB
    Image.find({ author: q },
      'title author desc',
      function (err, imgs) {
        if (err) {
          res.status(500).send('Invalid data!');
          return;
        }
        
        // read results
        imgList = []
        for (img of imgs){
          imgList.push({ 
            id: img._id, 
            title: img.title, 
            author: img.author, 
            desc: img.desc 
          });
        }
        
        // response
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ code: 0, data: { list: imgList } }));
      });
  } catch (e) {
    res.status(500).send('error ' + e);
  }
}