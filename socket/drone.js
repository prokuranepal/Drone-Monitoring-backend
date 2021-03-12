module.exports = (io) => {
    const app = require('express');
    const router = app.Router();
    const Drone = require('../models/drone');
    const Flight = require('../models/flight');
    const DroneData = require('../models/droneData');
    const User = require('../models/users');
    const Mission = require('../models/mission');
    const drone = io.of(/^\/JT\d+/);
    const createDMSEvent = require('./eventfunctions').createDMSEvent;

    drone.on('connection', (socket) => {
        let actualSocket = socket.nsp;
        const droneName = socket.nsp.name.replace('/', '');

        console.log(`Socket in ${droneName}: ${socket.id}`);
        // Joins the drone to the room and also make the status 1 - Active
        socket.on('joinDrone', (hospital_id) => {
            console.log(`socket of drone ${droneName} : ${socket.id}`);
            actualSocket.to('drone').clients((error, clients) => {
                if (error) throw error;
                if (clients.length == 0) {
                    Drone.findOne({
                            droneId: droneName
                        }).exec()
                        .then(async (data) => {
                            if (!data) throw data;
                            droneMessage = {
                                message: droneName,
                                status: 1,
                                date: new Date()
                            };
                            socket.join('drone');
                            data.status = 1;
                            data.save().catch((err) => console.log("Drone status update error"));
                            var flight = new Flight({
                                onTime: Date.now(),
                                drone: data._id
                            });
                            flight.save().catch((err) => console.log("Flight save error"));
                            io.to('dms').emit('notifications', droneMessage);
                            socket.emit('drone-conn', 'OK');
                            createDMSEvent(droneMessage, 'OK', 'dms', 'drone');
                        })
                        .catch(async (err) => {
                            socket.emit('drone-status', 'KO');
                            console.error(err);
                            var new_drone = new Drone({
                                droneId: droneName,
                                name: droneName,
                                status: 1,
                                type: 0,
                                hospital: hospital_id
                            });
                            await new_drone.save().catch((err) => console.log("Drone Save Error"));
                            var flight = new Flight({
                                onTime: Date.now(),
                                drone: new_drone._id
                            });
                            flight.save().catch((err) => console.log("Flight save error"));
                            io.to('dms').emit('notifications', droneMessage);
                            socket.emit('drone-conn', 'OK');
                            createDMSEvent(droneMessage, 'OK', 'dms', 'drone');
                        });
                } else {
                    socket.emit('drone-status', 'KO');
                }
            });
        });

        socket.on('joinDMS', (userid) => {
            console.log(`socket of joinDMS ${droneName} : ${socket.id} : ${userid}`);
            User.findById(userid).exec()
                .then((data) => {
                    if (!data) throw data;
                    socket.join('dms');
                    socket.emit('notifications', "drone dms OK");
                    actualSocket.to('drone').emit('homePosition', "send");
                    createDMSEvent(`Base DMS with user id ${userid} Connected to drone ${droneName}`, 'OK', 'dms', 'x');
                })
                .catch((err) => socket.emit('notifications', "drone dms KO"));
        });

        socket.on('mission', (mission) => {
            console.log("Mission : ", mission);
            console.log("Mission socket id : ", socket.id);

            actualSocket.in('drone').clients((error, clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    actualSocket.to('dms').emit('mission', mission);
                }
            });
            actualSocket.in('dms').clients((error, clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    Mission.findById(mission.mission).exec()
                        .then(async (mission_object) => {
                            actualSocket.to('drone').emit('mission', {
                                mission: mission_object,
                                timestamp: mission.timestamp
                            });
                            const drone = await Drone.findOne({
                                droneId: droneName
                            }).exec();
                            const all_flight_drone = await Flight.find({
                                drone: drone._id
                            }).exec();
                            const last_flight_drone = all_flight_drone[all_flight_drone.length-1];
                            Flight.findById(last_flight_drone._id)
                                .then(async (flightData) => {
                                    if (!flightData) throw "No flight data";
                                    flightData.mission = mission.mission;
                                    await flightData.save();
                                })
                        })
                        .catch((err) => console.log('mission not found'));
                }
            });
        });

        socket.on('getMission', (mission) => {
            console.log("get Mission : ", mission);
            console.log("socket id : ", socket.id);

            actualSocket.in('drone').clients((error, clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    actualSocket.to('dms').emit('getMission', mission);
                }
            });
            actualSocket.in('dms').clients((error, clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    actualSocket.to('drone').emit('getMission', mission);
                }
            });
        });

        socket.on('initiateFlight', (fly) => {
            console.log(fly);
            console.log(socket.id);
            actualSocket.in('drone').clients((error, clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    actualSocket.to('dms').emit('initiateFlight', fly);
                }
            });
            actualSocket.in('dms').clients((error, clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    actualSocket.to('drone').emit('initiateFlight', fly);
                }
            });
        });

        socket.on('homePosition', (homePosition) => {
            console.log(homePosition);
            actualSocket.in('drone').clients((error, clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    actualSocket.to('dms').emit('homePosition', homePosition);
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

        socket.on('payloadDrop', (status) => {
            console.log(status);
            actualSocket.in('drone').clients((error, clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    actualSocket.to('dms').emit('payloadDrop', status);
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
        
        socket.on('flight_start',(flight_start) => {
            console.log("Flight start", flight_start);
            actualSocket.in('drone').clients(async (error, clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    const drone = await Drone.findOne({
                        droneId: droneName
                    }).exec();
                    const all_flight_drone = await Flight.find({
                        drone: drone._id
                    }).exec();
                    const last_flight_drone = all_flight_drone[all_flight_drone.length-1];
                    Flight.findById(last_flight_drone._id)
                        .then(async (flightData) => {
                            if (!flightData) throw "No flight data";
                            if (flight_start==0){
                                flightData.startTime = Date.now();
                                await flightData.save();
                            } else if (flight_start==1) {
                                flightData.endTime = Date.now();
                                await flightData.save();
                            }
                        })
                }
            })
        })

        socket.on('data', (data) => {
            actualSocket.in('drone').clients(async (error, clients) => {
                if (error) throw error;
                if (clients.includes(socket.id)) {
                    actualSocket.to('dms').emit('copter-data', data);
                    const drone = await Drone.findOne({
                        droneId: droneName
                    }).exec();
                    const all_flight_drone = await Flight.find({
                        drone: drone._id
                    }).exec();
                    const last_flight_drone = all_flight_drone[all_flight_drone.length-1];
                    data['droneMission'] = last_flight_drone._id
                    let dronedata = new DroneData(data);
                    dronedata.save().catch((err) => console.log(`Error in dta save`));
                    // Flight.findById(last_flight_drone._id)
                    //     .then(async (flightData) => {
                    //         if (!flightData) throw "No flight data";
                    //         // TODO: data['status']=='ARMED' condition is needed
                    //         if (!flightData.startTime && data['mode'] == "AUTO") {
                    //             flightData.startTime = Date.now();
                    //             await flightData.save();
                    //         } else if (!flightData.endTime && data['mode']== "LAND") {
                    //             flightData.endTime = Date.now();
                    //             await flightData.save();
                    //         }
                    //     })
                } else {
                    socket.emit('drone-status', "KO");
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
            actualSocket.in('drone').clients((error, clients) => {
                if (error) throw error;
                if (clients.length === 0) {
                    Drone.findOne({
                            droneId: droneName
                        }).exec()
                        .then(async (data) => {
                            if (!data) throw data;
                            droneMessage = {
                                drone: droneName,
                                status: 0,
                                disconnected: new Date()
                            };
                            data.status = 0;
                            data.save();
                            const all_flight_drone = await Flight.find({
                                drone: data._id
                            }).exec();
                            const last_flight_drone = all_flight_drone[all_flight_drone.length-1];
                            Flight.findById(last_flight_drone._id)
                                .then(async (flightData) => {
                                    if (!flightData) throw "No flight data";
                                    flightData.offTime = Date.now();
                                    await flightData.save();
                                })
                            io.to('dms').emit('notifications', droneMessage);
                            console.log(`${droneName} drone with socket id ${socket.id} is disconnected`);
                            createDMSEvent(droneMessage, 'OK', 'dms', 'drone');
                        })
                        .catch((err) => console.log(`Error in db wirte ${droneName} drone with socket id ${socket.id} is disconnected`));
                }
            });
        });
    });
    return router;
}