module.exports = (io) => {
    const app = require('express');
    const router = app.Router();
    const Drone = require('../models/drone');
    const User = require('../models/users');

    require('./dms')(io);
    require('./drone')(io);
    

    return router;
}