const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');

const HealthFacilities = require('../models/healthFacilities');

const success_response = require('./functions/success_response');
const healthFacilitiesRouter = express.Router();

healthFacilitiesRouter.use(bodyParser.json());


healthFacilitiesRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
        let healthFacilities = [];
        healthFacilities.push(...await HealthFacilities.getHealthPostByHospital(req.user.healthFacilities._id));
        healthFacilities.push(await HealthFacilities.getHospitalByUser(req.user));
        success_response(res, healthFacilities);
    });
    
module.exports = healthFacilitiesRouter;