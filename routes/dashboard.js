const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');

const Drone = require('../models/drone');
const Mission = require('../models/mission');
const HealthPost = require('../models/healthpost');
const Hospital = require('../models/hospital');

const dashboardRouter = express.Router();

dashboardRouter.use(bodyParser.json());

dashboardRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, async (req, res, next) => {
        var totalDroneCount = await Drone.totalDroneCount();
        var flyingDroneCount = await Drone.flyingDroneCount();
        var totalDeliveries = await Mission.totalDeliveries();
        var totalHealthPosts = await HealthPost.totalHealthPosts();
        var request = await Mission.newRequest();
        var cdc_graph = await Hospital.getCDCGraph(req.query.hospitalId);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            'cards': {
                'totalDrones': totalDroneCount,
                'flyingDrone': flyingDroneCount,
                'totalDeliveries': totalDeliveries,
                'totalHealthPosts': totalHealthPosts,
                'request': request
            },
            'graphs': {
                'cdc': cdc_graph,
                'rhps': 'bbb'
            }
        });
    });

module.exports = dashboardRouter;