const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
    mission: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Mission',
        default: mongoose.Types.ObjectId()
    },
    startTime: {
        type: Date,
        default:null
    },
    endTime: {
        type: Date,
        default:null
    },
    onTime: {
        type: Date,
        default:null
    },
    offTime: {
        type: Date,
        default:null
    },
    drone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drone'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Flight',FlightSchema);