const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');

const Hospital = require('../models/hospital');

const hospitalRouter = express.Router();

hospitalRouter.use(bodyParser.json());

hospitalRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Hospital.find({})
            .then((hospital) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.cors, (req, res, next) => {
        Hospital.create(req.body)
            .then((hospital) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported /hospital`);
    })
    .delete(cors.cors, (req, res, next) => {
        Hospital.remove({})
            .then((hospital) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

hospitalRouter.route('/:hospitalId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Hospital.findById(req.params.hospitalId)
            .then((hospital) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported /hospital/${req.params.hospitalId}`);
    })
    .put(cors.cors, (req, res, next) => {
        Hospital.findByIdAndUpdate(req.params.hospitalId, {
                $set: req.body
            }, {
                new: true
            }).then((hospital) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.cors, (req, res, next) => {
        Hospital.findByIdAndRemove(req.params.hospitalId)
            .then((hospital) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = hospitalRouter;