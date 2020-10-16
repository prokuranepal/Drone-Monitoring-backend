const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const OrderSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    orderItem: [OrderItemSchema],
    orderDate: {
        type: Date,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    origin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthFacilities',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthFacilities',
        required: true
    },
    status: {
        type: String,
        enum: [
            'completed',
            'cancelled',
            'in processing',
            'delayed'
        ],
        default: 'in processing'
    },
    orderLifeCycle:{
        type: String,
        enum: [
            'Order Placed',
            'Order Confirmed',
            'Flight Confirmed',
            'Order Received'
        ],
        default:'Order Placed'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Orders', OrderSchema);