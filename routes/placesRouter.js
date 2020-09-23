const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');

const Places = require('../models/places');
const success_response = require('./functions/success_response');

const placesRouter = express.Router();

placesRouter.use(bodyParser.json());

placesRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Places.find({
                healthFacilities: req.user.healthFacilities
            })
            .then((places) => {
                success_response(res, places);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        req.body.healthFacilities = req.user.healthFacilities;
        Places.create(req.body)
            .then((places) => {
                success_response(res, places);

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported /places`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Places.remove({
                healthFacilities: req.user.healthFacilities
            })
            .then((places) => {
                let message = {
                    status: "OK",
                    msg:"Successfully Deleted"
                }
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

placesRouter.route('/:placesId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Places.findById(req.params.placesId)
            .then((places) => {
                success_response(res, places);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported /places/${req.params.placesId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        req.body.healthFacilities = req.user.healthFacilities;
        Places.findByIdAndUpdate(req.params.placesId, {
                $set: req.body
            }, {
                new: true
            }).then((places) => {
                success_response(res, places);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Places.findByIdAndRemove(req.params.placesId)
            .then((places) => {
                let message = {
                    status: "OK",
                    msg:"Successfully Deleted"
                }
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = placesRouter;