const mongoose = require("mongoose");

const HealthFacilitiesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    employee: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
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
        enum: ['hospital','healthpost'],
        required: true
    },
}, {
    timestamps: true
});

HealthFacilitiesSchema.statics.getHospitalByUser = async function(user_id) {
    var hospital = await this.findOne({employee:user_id,type:'hospital'}).exec();
    return hospital;
}

HealthFacilitiesSchema.statics.getHospitalByHealthpost = async function(healthpost_id) {
    var healthpost = await this.findById(healthpost_id).exec();
    return healthpost.hospital;
}

HealthFacilitiesSchema.statics.getTotalHospitalHealthPost = async function(hospital_id) {
    var totalHealthPost = await this.find({hospital:hospital_id}).exec();
    return totalHealthPost.length;
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
    console.log(hospital);
    // for (mission of hospital.mission) {
    //     // data_array[mission.createdAt.getYear()].append
    // }
    return hospital;
}


module.exports = mongoose.model('HealthFacilities', HealthFacilitiesSchema);