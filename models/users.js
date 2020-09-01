var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required:true,
        unique: true
    },
    phonenumber: {
        type: String,
        required: true,
        unique: true
    },
    healthFacilities:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'HealthFacilities',
        required:true
    },
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

User.plugin(passportLocalMongoose, { usernameField: 'email', usernameQueryFields: ['phonenumber'] });

module.exports = mongoose.model('User', User);