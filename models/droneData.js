const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DroneDataSchema = new Schema({},{ strict: false});

module.exports = mongoose.model('DroneData', DroneDataSchema); 