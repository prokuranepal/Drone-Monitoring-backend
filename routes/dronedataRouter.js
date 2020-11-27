const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');

const Drone_data = require('../models/droneData');
const success_response = require('./functions/success_response');

const droneDataRouter = express.Router();
const flightDataRouter = express.Router();

droneDataRouter.use(bodyParser.json());
flightDataRouter.use(bodyParser.json());

droneDataRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, (req, res, next) => {
        Drone_data.find({})
            .then((drones) => {
                success_response(res, drones);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        Drone_data.create(req.body)
            .then((drones) => {
                success_response(res, drones);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

droneDataRouter.route('/:droneDataId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, (req, res, next) => {
        Drone_data.findById(req.params.droneDataId)
            .then((drone_data) => {
                
                success_response(res, drone_data);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// flightDataRouter.route('/')
//     .options(cors.corsWithOptions, (req, res) => {
//         res.sendStatus(200);
//     })
//     .get(cors.corsWithOptions, (req, res, next) => {
//         Drone_data.find({})
//             .then((drones) => {
//                 success_response(res, drones);
//             }, (err) => next(err))
//             .catch((err) => next(err));
//     });


flightDataRouter.route('/:droneMissionId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, (req, res,next) => {
        droneMissionId = mongoose.mongo.ObjectId(req.params.droneMissionId)
        Drone_data.find({
                droneMission: droneMissionId
            })
            .then((drone_data) => {
                console.log(drone_data);
                success_response(res, drone_data);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = {
    droneDataRouter,
    flightDataRouter
};