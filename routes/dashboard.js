const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');

const Drone = require('../models/drone');
const Mission = require('../models/mission');
const HealthFacilities = require('../models/healthFacilities');

const dashboardRouter = express.Router();

dashboardRouter.use(bodyParser.json());

dashboardRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser,async (req, res, next) => {
        var hospital = await HealthFacilities.getHospitalByUser(req.user.healthFacilities);
        if (hospital){
            hospitalId = hospital._id;
        } else {
            hospitalId = null;
        }
        var totalDroneCount = await Drone.getTotalHospitalDrone(hospitalId);
        var flyingDroneCount = await Drone.getTotalHospitalFlyingDrone(hospitalId);
        var totalDeliveries = await Mission.getTotalHospitalDeliveries(hospitalId);
        var totalHealthPosts = await HealthFacilities.getTotalHospitalHealthPost(hospitalId);
        var request = await Mission.getRequestToHospital(hospitalId);
        var cdc_graph = await Mission.getGraphCDCData(hospitalId);
        var rhps_graph = await Mission.getGraphRHPSData(hospitalId);

        var cards = {
            'drones': totalDroneCount,
            'activeDrones': flyingDroneCount,
            'deliveries': totalDeliveries,
            'subHealthPosts': totalHealthPosts
        };

        var graphs = {
            hospital: cdc_graph,
            healthPosts: rhps_graph
        };

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            'cardData': cards,
            'graphs': graphs
        });
    });

module.exports = dashboardRouter;