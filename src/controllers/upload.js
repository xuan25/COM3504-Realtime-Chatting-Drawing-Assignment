const Image = require('../models/images');
const fetch = require('node-fetch');

// get upload page
exports.getIndex = function (req, res){
  res.render('upload', { title: "Upload" });
}

// wrap model.save to an async function
function saveModelAsync (model) {
  return new Promise(function (resolve, reject) {
    model.save(function (err, result) {
      if (err){
        reject(err);
      }
      resolve(result);
    });
  });
}

// upload ajax api
exports.upload = async function (req, res) {
  let data = req.body;
  if (data == null) {
    res.status(403).send('No data sent!')
  }
  try {
    imgData = null;

    // upload types
    if (data.imgType === 'http'){
      // download the image from the url
      img_url = data.img
      img_res = await fetch(img_url, { 
        method: 'GET'
      });
      buf = await img_res.buffer();
      contentType = img_res.headers.get("content-type");
      base64 = await buf.toString('base64');
      imgData = `data:${contentType};base64,` + base64;
    }
    else if (data.imgType === 'data'){
      // no more actions
      imgData = data.img
    }
    else {
      res.status(500).send('Invalid data!');
    }

    // construct data model
    let image = new Image({
      title: data.title,
      author: data.author,
      desc: data.desc,
      data: imgData
    });

    // save model
    imageResult = await saveModelAsync(image);
    imgId = imageResult._id

    // response imgId
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ code:0, data: { imgId: imgId } }));
  }
  catch (e) {
    res.status(500).send('error ' + e);
  }
}
