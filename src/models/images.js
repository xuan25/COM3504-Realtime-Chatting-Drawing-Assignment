let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Image = new Schema(
  {
    title: {type: String, required: true},
    author: {type: String, required: true},
    desc: {type: String, required: true},
    data: {type: String, required: true}
  }
);

let imageModel = mongoose.model('Image', Image );

module.exports = imageModel;
