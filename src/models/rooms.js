let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Room = new Schema(
    {
        imgId: {type: String, required: true},
        title: {type: String, required: true},
        author: {type: String, required: true},
        desc: {type: String, required: true},
    }
);

let roomModel = mongoose.model('Room', Room );

module.exports = roomModel;
