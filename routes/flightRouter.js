const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');

const Flight = require('../models/flight');
const success_response = require('./functions/success_response');

const flightRouter = express.Router();

flightRouter.use(bodyParser.json());

flightRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Flight.find({})
            .then((flight) => {
                success_response(res, flight);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

flightRouter.route('/:flightId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Flight.findById(req.params.flightId)
            .populate({
                path:'mission',
                populate:[{
                    path:'destination',
                    select:'name'
                },{
                    path:'hospital',
                    select:'name'
                }]
            })
            .populate({
                path:'drone',
                select:"droneId"
            })
            .then((flight) => {
                success_response(res, flight);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

flightRouter.route('/drone/:droneId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Flight.find({
                drone: req.params.droneId
            })
            .populate('mission')
            .then((flight) => {
                success_response(res, flight);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = flightRouter;