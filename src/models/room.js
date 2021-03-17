let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Room = new Schema(
    {
        room_id: {type: String, required: true},
        img: {type: String, required: true},
        dob: {type: Number},
        whatever: {type: String} //any other field
    }
);

// Virtual for a character's age
Character.virtual('age')
    .get(function () {
        const currentDate = new Date().getFullYear();
        const result= currentDate - this.dob;
        return result;
    });

Character.set('toObject', {getters: true, virtuals: true});


let characterModel = mongoose.model('Character', Character );

module.exports = characterModel;
