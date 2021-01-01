const { json } = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MaintenanceSchema = new Schema({
    droneId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Drone',
        required: true,
    },
    name: {
        type:String,
        required:true,
    },
    description : {
        type: String,
        required : true,
    },
    status: {
        type: Number,
        enum: [0,1,2,3],
        default : 0,
    },
    createdDate: {
        type: Date,
        default:null,
    },
    dueDate: {
        type:Date,
        default:null,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);