const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MissionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'requested', 'cancel'],
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
    requested_item: {
        type: String,
        enum: ['medicine','vaccine','blood', 'none']
    },
    // TODO: Can be used to store mission file or complete mission
    missionObject: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

MissionSchema.statics.totalDeliveries = function () {
    return this.countDocuments({
        status: 'completed'
    });
};

MissionSchema.statics.newRequest = function () {
    return this.countDocuments({
        status: 'requested'
    });
};

module.exports = mongoose.model('Mission', MissionSchema);