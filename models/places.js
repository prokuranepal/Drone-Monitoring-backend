const mongoose = require("mongoose");

const PlacesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gps_location: {
        'type': {
            type: String,
            required: true,
            enum: ['Point']
        },
        coordinates: [Number],
        select: false
    },
    healthFacilities:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'HealthFacilities',
        required:true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Places', PlacesSchema);