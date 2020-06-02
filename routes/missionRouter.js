const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');

const Mission = require('../models/mission');

const missionRouter = express.Router();

missionRouter.use(bodyParser.json());

missionRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Mission.find({})
            .then((missions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(missions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.cors, (req, res, next) => {
        Mission.create(req.body)
            .then((missions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(missions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported /mission`);
    })
    .delete(cors.cors, (req, res, next) => {
        Mission.remove({})
            .then((missions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(missions);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

missionRouter.route('/:missionId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Mission.findById(req.params.missionId)
            .then((mission) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(mission);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported /mission/${req.params.missionId}`);
    })
    .put(cors.cors, (req, res, next) => {
        Mission.findByIdAndUpdate(req.params.missionId, {
                $set: req.body
            }, {
                new: true
            }).then((mission) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(mission);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.cors, (req, res, next) => {
        Mission.findByIdAndRemove(req.params.missionId)
            .then((mission) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(mission);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = missionRouter;