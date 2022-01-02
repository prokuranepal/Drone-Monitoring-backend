const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const UserRole = require('../utils/utils').UserRole;

const authenticate = require('../authenticate');
const cors = require('./cors');

const Flight = require('../models/flight');
const Drone = require('../models/drone');
const success_response = require('./functions/success_response');

const flightRouter = express.Router();

flightRouter.use(bodyParser.json());

flightRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), async (req, res, next) => {
        let hospital = req.user.bodiesId;
        drones = await Drone.find({"hospital":hospital}).exec();
        Flight.find({drones: {$in: drones}})
            .then((flight) => {
                let data ={
                    "flights": flight
                }
                let flightCards = {};
                let totalTime = 0;
                for (flit of flight) {
                    totalTime += flit.endTime - flit.startTime;
                }
                flightCards.flyingTime = total_time;
                flightCards.numOfFlights = flight.length;
                flightCards.landings = flight.length;
                flightCards.crashes = flightCards.numOfFlights - flightCards.landings;
                data.flightCards = flightCards;
                success_response(res, data);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

flightRouter.route('/:flightId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
        Flight.findById(req.params.flightId)
            .populate({
                path: 'mission',
                populate: [{
                    path: 'destination',
                    select: 'name'
                }, {
                    path: 'hospital',
                    select: 'name'
                }]
            })
            .populate({
                path: 'drone',
                select: "droneId"
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
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
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