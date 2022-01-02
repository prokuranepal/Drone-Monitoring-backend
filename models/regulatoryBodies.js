const mongoose = require("mongoose");

const RegulatoryBodiesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: true
    },
    landlineNumber: {
        type: String,
        required: true
    },
    employee: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('RegulatoryBodies', RegulatoryBodiesSchema);