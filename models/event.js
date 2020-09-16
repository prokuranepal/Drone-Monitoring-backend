const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DMSEventSchema = new Schema({
    eventMessage: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required:true,
    },
    from: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DMSEvent', DMSEventSchema);