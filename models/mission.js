const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MissionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'requested','Cancel'],
        default: 'requested'
    },
    home: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    // TODO: Can be used to store mission file or complete mission
    missionObject: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Mission', MissionSchema);