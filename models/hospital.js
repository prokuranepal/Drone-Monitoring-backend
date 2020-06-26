const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
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
    drone: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drone'
    }],
    mission: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mission'
    }],
    healthPost: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthPost'
    }]
}, {
    timestamps: true
});

get_one_year_back_date = () => {
    var today_date = new Date();
    var this_year = today_date.getFullYear();
    var this_month = today_date.getMonth();
    return today_date.setFullYear(this_year - 1, this_month, 1);
}

HospitalSchema.statics.getCDCGraph = async function (hospital_id) {
    var data_array = {};
    var one_year_back = get_one_year_back_date();

    var hospital = await this.findById(hospital_id).populate({
        path: 'mission',
        match: {
            status: 'completed',
            updatedAt: {
                $gte: one_year_back
            }
        },
        select: 'updatedAt requested_item createdAt',
        sort: 'updatedAt'
    }).select('mission').exec();

    data_array = {
        'medicine': [0,0,0,0,0,0,0,0,0,0,0,0],
        'vaccine': [0,0,0,0,0,0,0,0,0,0,0,0],
        'blood': [0,0,0,0,0,0,0,0,0,0,0,0]
    }

    var today_date = new Date();
    for (mission of hospital.mission) {
        if (mission.requested_item == 'medicine') {
            data_array.medicine[mission.createdAt.getMonth()] +=1;
        } else if (mission.requested_item == 'vaccine') {
            data_array.vaccine[mission.createdAt.getMonth()] +=1;
        } else if (mission.requested_item == 'blood') {
            data_array.blood[mission.createdAt.getMonth()] +=1;
        }
    }
    medicine_splice = data_array.medicine.splice(0,today_date.getMonth()+1)
    vaccine_splice = data_array.vaccine.splice(0,today_date.getMonth()+1)
    blood_splice = data_array.blood.splice(0,today_date.getMonth()+1)
    data_array.medicine.push(...medicine_splice)
    data_array.vaccine.push(...vaccine_splice)
    data_array.blood.push(...blood_splice)
    return data_array
}

module.exports = mongoose.model('Hospital', HospitalSchema);