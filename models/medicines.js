const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Medicine = new Schema({
    title: {
        type: String,
        required: true
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
    man_date: {
        type:Date,
        required: true
    },
    exp_date: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        default:''
    },
    price: {
        type:Number,
        default:0.0,
        min: 0.0
    },
    description: {
        type:String,
        default:''
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
        ref:'healthfacilities',
        required:true
    },
    suppliers:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Suppliers',
        required:true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Medicine', Medicine);