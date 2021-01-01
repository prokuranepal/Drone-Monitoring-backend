var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required:true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    healthFacilities:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'HealthFacilities',
        required:true
    },
    province: {
        type:String,
        default:null,
    },
    district: {
        type:String,
        default: null,
    },
    town: {
        type:String,
        default:null,
    },
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

User.plugin(passportLocalMongoose, { usernameField: 'email', usernameQueryFields: ['phoneNumber'] });

module.exports = mongoose.model('User', User);