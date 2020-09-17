module.exports = (io) => {
    const app = require('express');
    const router = app.Router();
    const Drone = require('../models/drone');
    const User = require('../models/users');
    const Mission = require('../models/mission');
    const drone = io.of(/^\/JT\d+/);
    const createDMSEvent = require('./eventfunctions').createDMSEvent;

    drone.on('connection', (socket) => {
        let actualSocket = socket.nsp;
        const droneName = socket.nsp.name.replace('/', '');
        console.log("socket id drone : ", socket.id);

        // Joins the drone to the room and also make the status 1 - Active
        socket.on('joinDrone', () => {
            actualSocket.to('drone').clients((error, clients) => {
                if (error) throw error;
                if (clients.length == 0) {
                    Drone.findOne({
                            droneId: droneName
                        }).exec()
                        .then((data) => {
                            if (!data) throw data;
                            droneMessage = {
                                message: droneName,
                                status: 1,
                                date: new Date()
                            };
                            socket.join('drone');
                            data.status = 1;
                            data.save();
                            io.to('dms').emit('notifications', droneMessage);
                            socket.emit('drone-conn', 'OK');
                            createDMSEvent(droneMessage,'OK','dms','drone');
                        })
                        .catch((err) => socket.emit('drone-status', 'KO'));
                } else {
                    socket.emit('drone-status', 'KO');
                }
            });
        });

        socket.on('joinDMS', (userid) => {
            console.log(socket.id);
            User.findById(userid).exec()
                .then((data) => {
                    if (!data) throw data;
                    socket.join('dms');
                    socket.emit('notifications', "drone dms OK");
                    actualSocket.to('drone').emit('homePosition',"send");
                    createDMSEvent(`Base DMS with user id ${userid} Connected to drone ${droneName}`,'OK','dms','x');
                })
                .catch((err) => socket.emit('notifications', "drone dms KO"));
        });

        socket.on('mission', (mission) => {
            console.log("Mission : ",mission);
            console.log("Mission socket id : ",socket.id);

            actualSocket.in('drone').clients((error,clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)){
                    actualSocket.to('dms').emit('mission',mission);
                }
            });
            actualSocket.in('dms').clients((error,clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    Mission.findById(mission.mission).exec()
                        .then((mission_object) => {
                            actualSocket.to('drone').emit('mission',{mission:mission_object,timestamp:mission.timestamp});
                        })
                        .catch((err) => console.log('mission not found'));
                }
            });
        });

        socket.on('getMission', (mission) => {
            console.log("get Mission : ", mission);
            console.log("socket id : ",socket.id);

            actualSocket.in('drone').clients((error,clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)){
                    actualSocket.to('dms').emit('getMission',mission);
                }
            });
            actualSocket.in('dms').clients((error,clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)){
                    actualSocket.to('drone').emit('getMission',mission);
                }
            });
        });

        socket.on('initiateFlight', (fly) => {
            console.log(fly);
            console.log(socket.id);
            actualSocket.in('drone').clients((error,clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)){
                    actualSocket.to('dms').emit('initiateFlight',fly);
                }
            });
            actualSocket.in('dms').clients((error,clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    actualSocket.to('drone').emit('initiateFlight',fly);
                }
            });
        });

        socket.on('homePosition',(homePosition) => {
            console.log(homePosition);
            actualSocket.in('drone').clients((error,clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)){
                    actualSocket.to('dms').emit('homePosition',homePosition);
                }
            });
        });

        socket.on('land', (land) => {
            actualSocket.in('dms').clients((error, clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    actualSocket.to('drone').emit('land', land);
                }
            })
        });
        
        socket.on('rtl', (rtl) => {
            actualSocket.in('dms').clients((error, clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    actualSocket.to('drone').emit('rtl', rtl);
                }
            })
        });

        socket.on('data', (data) => {
            actualSocket.in('drone').clients((error, clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    actualSocket.to('dms').emit('copter-data', data);
                } else {
                    socket.emit('drone-status',"KO");
                }
            });
        });


        socket.on('list-sockets', () => {
            console.log("--------------------------------------");
            actualSocket.to('dms').clients((error, clients) => {
                if (error) throw error;
                console.log("DMS : ", clients);
            });
            actualSocket.to('drone').clients((error, clients) => {
                if (error) throw error;
                console.log("Drone :", clients);
            });
        });

        socket.on('disconnect', () => {
            actualSocket.in('drone').clients((error,clients) => {
                if (error) throw error;
                if (clients.length === 0){
                    Drone.findOne({
                        droneId: droneName
                    }).exec()
                    .then((data) => {
                        if (!data) throw data;
                        droneMessage = {
                            drone: droneName,
                            status: 0,
                            disconnected: new Date()
                        };
                        data.status = 0;
                        data.save();
                        io.to('dms').emit('notifications', droneMessage);
                        console.log(`${droneName} drone with socket id ${socket.id} is disconnected`);
                        createDMSEvent(droneMessage,'OK','dms','drone');
                    })
                    .catch((err) => console.log(`Error in db wirte ${droneName} drone with socket id ${socket.id} is disconnected`));
                }
            });
        });
    });
    return router;
}