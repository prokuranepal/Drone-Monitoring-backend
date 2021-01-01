const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');

const Maintenance = require('../models/maintenance');
const Drone = require('../models/drone');
const success_response = require('./functions/success_response');
const drone = require('../models/drone');

const maintenanceRouter = express.Router();

maintenanceRouter.use(bodyParser.json());

maintenanceRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Maintenance.find()
            .populate({
                path: "droneId",
                select: "droneId type"
            })
            .then((maintenances) => {
                success_response(res, maintenances);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        Maintenance.create(req.body)
            .then(async (maintenances) => {
                if (maintenances.status === 2 ){
                    await Drone.findByIdAndUpdate(maintenances.droneId,{
                        $set: {status:0}
                    }, {
                        new: true
                    }).exec();
                } else {
                    await Drone.findByIdAndUpdate(maintenances.droneId,{
                        $set: {status:2}
                    }, {
                        new: true
                    }).exec();
                }
                success_response(res, maintenances);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported /maintenance`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Maintenance.remove()
            .then((_) => {
                let message = {
                    msg: 'Successfully Deleted',
                    status: 'OK'
                };
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

maintenanceRouter.route('/details')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Maintenance.find()
            .populate({
                path: "droneId",
                select: "droneId type"
            })
            .then((maintenances) => {
                status_0 = maintenances.filter(maintenance => maintenance.status === 0).length;
                status_1 = maintenances.filter(maintenance => maintenance.status === 1).length;
                status_2 = maintenances.filter(maintenance => maintenance.status === 2).length;
                status_3 = maintenances.filter(maintenance => maintenance.status === 3).length;
                let response_data = {
                    'cards': {
                        'open': status_0,
                        'inProgress':status_1,
                        'completed':status_2,
                        'overdue':status_3,
                    },
                    'data':maintenances
                }
                success_response(res, response_data);
            })
    });

maintenanceRouter.route('/:maintenanceId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Maintenance.findById(req.params.maintenanceId)
            .populate({
                path: 'droneId',
                select: 'droneId type '
            })
            .then((maintenance) => {
                success_response(res, maintenance);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported /maintenance/${req.params.maintenanceId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        req.body.hospital = req.user.healthFacilities;
        Maintenance.findByIdAndUpdate(req.params.maintenanceId, {
                $set: req.body
            }, {
                new: true
            }).then(async (maintenance) => {
                if (maintenance.status === 2 ){
                    await Drone.findByIdAndUpdate(maintenance.droneId,{
                        $set: {status:0}
                    }, {
                        new: true
                    }).exec();
                } else {
                    await Drone.findByIdAndUpdate(maintenance.droneId,{
                        $set: {status:2}
                    }, {
                        new: true
                    }).exec();
                }
                success_response(res, maintenance);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Maintenance.findByIdAndRemove(req.params.maintenanceId)
            .then((_) => {
                let message = {
                    msg: 'Successfully Deleted',
                    status: 'OK'
                };
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = maintenanceRouter;