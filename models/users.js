var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var UserRole = require('../utils/utils').UserRole;

var User = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    bodiesType: {
        type: String,
        required: false,
        enum: [UserRole.SuperAdmin, UserRole.RegulatoryBody, UserRole.Hospital, UserRole.HealthPost]
    },
    bodiesId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    department: {
        type: String,
        required: false
    },
    position: {
        type: String,
        required: false
    },
}, {
    timestamps: true
});

User.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameQueryFields: ['phoneNumber']
});

module.exports = mongoose.model('User', User);