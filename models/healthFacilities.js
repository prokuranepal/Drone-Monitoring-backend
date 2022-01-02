const mongoose = require("mongoose");

const HealthFacilitiesSchema = new mongoose.Schema({
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
    medicine: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine'
    }],
    gps_location: {
        'type': {
            type: String,
            required: false,
            enum: ['Point']
        },
        coordinates: [Number],
        select: false
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthFacilities'
    },
    type: {
        type:String,
        enum: ['Hospital','Health Post'],
        required: true
    },
}, {
    timestamps: true
});

HealthFacilitiesSchema.statics.getHospitalByUser = async function(healthFacilities_id) {
    var hospital = await this.findOne({_id:healthFacilities_id, type:"Hospital"}).exec();
    return hospital;
}

HealthFacilitiesSchema.statics.getTotalHospital = async function() {
    var hospital = await this.find({type:"Hospital"}).exec();
    return hospital.length;
}

HealthFacilitiesSchema.statics.getHospitalByHealthpost = async function(healthpost_id) {
    var healthpost = await this.findById(healthpost_id).exec();
    return healthpost.hospital;
}

HealthFacilitiesSchema.statics.getTotalHospitalHealthPost = async function(hospital_id) {
    var totalHealthPost = await this.find({hospital:hospital_id,type:"Health Post"}).exec();
    return totalHealthPost.length;
}

HealthFacilitiesSchema.statics.getHealthPostByHospital = async function(hospital_id) {
    var totalHealthPost = await this.find({hospital:hospital_id,type:"Health Post"}).exec();
    return totalHealthPost;
}


HealthFacilitiesSchema.statics.getgraphdata = async function(hospital_id) {
    var hospital = await this.findById(hospital_id).populate({
        path:'mission',
        match: {
            status: 'completed',
        },
        select: 'updatedAt requested_item createdAt',
        sort: 'updatedAt'
    }).select('mission').exec();
    var data_array = {};
    // for (mission of hospital.mission) {
    //     // data_array[mission.createdAt.getYear()].append
    // }
    return hospital;
}


module.exports = mongoose.model('HealthFacilities', HealthFacilitiesSchema);