const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DroneSchema = new Schema({
    droneId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [0, 1, 2],
        default: 0
    },
    type: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        default: 0
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthFacilities'
    },
    numOfFlight: {
        type: Number,
        default: 0
    },
    mission: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mission'
    }],
}, {
    timestamps: true
});

DroneSchema.statics.getTotalHospitalDrone = async function (hospital_id) {
    var totalDrone = await this.find({
        hospital: hospital_id
    }).exec();
    return totalDrone.length;
}

DroneSchema.statics.getTotalHospitalFlyingDrone = async function (hospital_id) {
    var totalDrone = await this.find({
        hospital: hospital_id,
        status: 1
    }).exec();
    return totalDrone.length;
}

module.exports = mongoose.model('Drone', DroneSchema);