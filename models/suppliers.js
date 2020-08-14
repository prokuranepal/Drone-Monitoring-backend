const mongoose = require("mongoose");

const SuppliersSchema = new mongoose.Schema({

    Name: {
        type: String,
        required: [true, 'suppliers name required']
    },

    Contact: {
        type: Number,

        required: true
    },

    Medicinetype: [{
        type: String
    }],
}, {

    timestamps: true
});

module.exports = mongoose.model('Suppliers', SuppliersSchema);