module.exports = (io) => {
    const app = require('express');
    const router = app.Router();
    const User = require('../models/users');
    const createDMSEvent = require('./eventfunctions').createDMSEvent;

    io.on('connection', (socket) => {
        console.log("socket id : ", socket.id);
        socket.on('joinDMS', (userid) => {
            User.findById(userid).exec()
                .then((data) => {
                    if (!data) throw data;
                    socket.join('dms');
                    message = {
                        message:`Base DMS connected with user id ${userid}`,
                        status:1,
                        date: new Date()
                    };
                    socket.emit("notifications", message);
                    createDMSEvent(message, "OK", "dms", "x");
                })
                .catch((err) => socket.emit("notifications", "base dms KO"));
        });

        socket.on('list-sockets', () => {
            console.log("--------------------------------------");
            io.to('dms').clients((error, clients) => {
                if (error) throw error;
                console.log("DMS : ", clients);
            })
        });

        socket.on('disconnect', () => {
            console.log(`${socket.id} is diconnected`);
        });
    });
    return router;
}