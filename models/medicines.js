const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Medicine = new Schema({
    name: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required:true,
    },
    quantity: {
        type: Number,
        min: 0,
        default: 0
    },
    company: {
        type: String,
        default: ''
    },
    exp_date: {
        type: String,
        required: true
    },
    price: {
        type:Number,
        default:0.0,
        min: 0.0
    },
    type: {
        type: String,
        required: true
    },
    user_added:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    healthFacilities:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'HealthFacilities',
        required:true
    },
    suppliers:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Suppliers',
        // required:true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Medicine', Medicine);