const Image = require('../models/images');
const fetch = require('node-fetch');

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

exports.newUpload = async function (req, res) {
    let data = req.body;
    if (data == null) {
        res.status(403).send('No data sent!')
    }
    try {
        img_data = null;

        if (data.imgType === 'http'){
            img_url = data.img
            img_res = await fetch(img_url, { 
                method: 'GET'
            });
            buf = await img_res.buffer();
            contentType = img_res.headers.get("content-type");
            base64 = await buf.toString('base64');
            img_data = `data:${contentType};base64,` + base64;
        }
        else if (data.imgType === 'data'){
            img_data = data.img
        }
        else {
            res.status(500).send('Invalid data!');
        }

        let image = new Image({
            title: data.title,
            author: data.author,
            desc: data.desc,
            data: img_data
        });

        imageResult = await saveModelAsync(image);
        imgId = imageResult._id

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ code:0, data: { imgId: imgId } }));
    }
    catch (e) {
        res.status(500).send('error ' + e);
    }
}
