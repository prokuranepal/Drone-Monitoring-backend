const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');

const Drone = require('../models/drone');
const success_response = require('./functions/success_response');

const droneRouter = express.Router();

droneRouter.use(bodyParser.json());

droneRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        let query_object = {
            hospital:req.user.healthFacilities
        }
        if (req.query.type) {
            query_object.type = req.query.type;
        }
        if (req.query.status) {
            query_object.status = req.query.status;
        }
        Drone.find(query_object)
            .select('-mission')
            .then((drones) => {
                success_response(res, drones);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        req.body.hospital = req.user.healthFacilities;
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
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Drone.remove({
                hospital: req.user.healthFacilities
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
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Drone.findById(req.params.droneId)
            .then((drone) => {
                success_response(res, drone);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported /drone/${req.params.droneId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        console.log(req.body);
        req.body.hospital = req.user.healthFacilities;
        Drone.findByIdAndUpdate(req.params.droneId, {
                $set: req.body
            }, {
                new: true
            }).then((drone) => {
                success_response(res, drone);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
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


module.exports = droneRouter;