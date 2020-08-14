const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const start_year = 2020;
const month_name = ['Jan', 'Feb', 'Mar', 'Api', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const HealthPost = require('./healthFacilities');
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
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthFacilities'
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthFacilities'
    },
    requested_item: {
        type: String,
        enum: ['medicine', 'vaccine', 'blood', 'none']
    },
    // TODO: Can be used to store mission file or complete mission
    missionObject: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});

MissionSchema.statics.getTotalHospitalDeliveries = async function (hospital_id) {
    var totalDeliveries = await this.find({
        hospital: hospital_id,
        status: 'completed'
    }).exec();
    return totalDeliveries.length;
}

MissionSchema.statics.getRequestToHospital = async function (hospital_id) {
    var new_request = await this.find({
        hospital: hospital_id,
        status: 'requested'
    }).exec();
    return new_request;
}

MissionSchema.statics.getGraphCDCData = async function (hospital_id) {
    var all_mission = await this.find({
        hospital: hospital_id,
        status: 'completed'
    }).sort({
        createdAt: 'asc'
    }).exec();
    var data_list = {}
    var today_date = new Date();
    var this_year = today_date.getFullYear();
    for (year = start_year; year <= this_year; year++) {
        data_list[year] = []
        for (mon in month_name) {
            var name = month_name[mon];
            var delivery = all_mission.filter((mission) => {
                return mission.createdAt.getFullYear() == year && mission.createdAt.getMonth() == mon;
            }).length;
            data_list[year].push({
                month: name,
                deliveries: delivery
            });
        }
    }
    return data_list;
}

MissionSchema.statics.getGraphRHPSData = async function (hospital_id) {
    var healthpost_data = await HealthPost.find({
        hospital: hospital_id
    }).exec();
    var healthost_list = [];
    for (healthpost of healthpost_data) {
        var all_mission = await this.find({
            destination: healthpost._id,
            status: 'completed'
        }).sort({
            createdAt: 'asc'
        }).exec();
        var data_list = {}
        var today_date = new Date();
        var this_year = today_date.getFullYear();
        for (year = start_year; year <= this_year; year++) {
            data_list[year] = {}
            for (mon in month_name) {
                var name = month_name[mon];
                var delivery = all_mission.filter((mission) => {
                    return mission.createdAt.getFullYear() == year && mission.createdAt.getMonth() == mon;
                }).length;
                data_list[year][name] = delivery;
            }
        }
        healthost_list.push({
            name: healthpost.name,
            data : data_list
        });
    }

    return healthost_list;
}

module.exports = mongoose.model('Mission', MissionSchema);