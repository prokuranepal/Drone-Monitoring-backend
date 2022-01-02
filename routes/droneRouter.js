const express = require('express');
const bodyParser = require('body-parser');
const UserRole = require('../utils/utils').UserRole;
const authenticate = require('../authenticate');
const cors = require('./cors');

const Drone = require('../models/drone');
const Flight = require('../models/flight');
const success_response = require('./functions/success_response');

const fs = require('fs');
const path = require('path');

const droneRouter = express.Router();

droneRouter.use(bodyParser.json());

droneRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin, UserRole.Hospital, UserRole.RegulatoryBody]), (req, res, next) => {
        let query_object = {};
        if ([UserRole.SuperAdmin, UserRole.RegulatoryBody].includes(req.user.bodiesType)) {
            query_object = {};
        } else if (req.user.bodiesType === UserRole.Hospital) {
            query_object = {
                hospital: req.user.bodiesId
            };
        }
        if (req.query.type) {
            query_object.type = req.query.type;
        }
        if (req.query.status) {
            query_object.status = req.query.status;
        }
        Drone.find(query_object)
            .select('-mission')
            .populate([{
                path: 'hospital',
                select: 'name',
                model: 'HealthFacilities'
            }])
            .then((drones) => {
                success_response(res, drones);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
        req.body.hospital = req.user.bodiesId;
        Drone.create(req.body)
            .then((drones) => {
                success_response(res, drones);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported /drone`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
        Drone.remove({
                hospital: req.user.bodiesId
            })
            .then((drones) => {
                let message = {
                    msg: 'Successfully Deleted',
                    status: 'OK'
                };
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

droneRouter.route('/:droneId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin, UserRole.Hospital, UserRole.RegulatoryBody]), (req, res, next) => {
        Drone.findById(req.params.droneId)
            .then((drone) => {
                Flight.find({
                        drone: req.params.droneId
                    }).select("_id startTime endTime")
                    .populate({
                        path: 'mission',
                        select: 'status destination hospital',
                        populate: [{
                            path: 'destination',
                            select: 'name'
                        }, {
                            path: 'hospital',
                            select: 'name'
                        }]
                    })
                    .then((flight) => {
                        let dta = drone.toJSON();
                        dta.flights = [];
                        let total_time = 0;
                        for (flit of flight) {
                            if (flit.mission != null) {
                                dta.flights.push(flit);
                                total_time += flit.endTime - flit.startTime;
                            }
                        }
                        dta.numOfFlights = dta.flights.length;
                        dta.flightTime = total_time;
                        dta.crashes = 0;
                        success_response(res, dta);
                    }, (err) => next(err))
                    .catch((err) => next(err));
                // success_response(res, drone);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported /drone/${req.params.droneId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
        req.body.hospital = req.user.bodiesId;
        Drone.findByIdAndUpdate(req.params.droneId, {
                $set: req.body
            }, {
                new: true
            }).then((drone) => {
                success_response(res, drone);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
        Drone.findByIdAndRemove(req.params.droneId)
            .then((drone) => {
                let message = {
                    msg: 'Successfully Deleted',
                    status: 'OK'
                };
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

droneRouter.route('/:droneId/export')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Flight.find({
                drone: req.params.droneId
            })
            .then(async (flight) => {
                let drone_data = JSON.stringify(flight);
                let public_route = path.join(__dirname, '../public/media/');
                let fileName = 'drone-data.json'
                await fs.writeFileSync(public_route + fileName, drone_data);
                res.download(public_route + fileName);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

droneRouter.route('/:droneId/:missionId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Drone.findById(req.params.droneId)
            .populate('mission.mission')
            .then((drone) => {
                send_data = drone.mission.find((data) => {
                    if (data._id == req.params.missionId) {
                        return true
                    }
                });

                success_response(res, send_data);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = droneRouter;