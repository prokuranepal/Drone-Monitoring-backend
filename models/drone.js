const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DroneSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'unactive', 'destroyed'],
        default: 'unactive'
    },
    type: {
        type: String,
        enum: ['VTOL', 'Plane', 'Quad', 'Octo', 'Hexa'],
        default: 'Quad'
    },
    hospital: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'HealthFacilities'
    },
    mission: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mission'
    }],
}, {
    timestamps: true
});

DroneSchema.statics.getTotalHospitalDrone = async function(hospital_id) {
    var totalDrone = await this.find({hospital:hospital_id}).exec();
    return totalDrone.length;
}

DroneSchema.statics.getTotalHospitalFlyingDrone = async function(hospital_id) {
    var totalDrone = await this.find({hospital:hospital_id,status:'active'}).exec();
    return totalDrone.length;
}

module.exports = mongoose.model('Drone', DroneSchema);