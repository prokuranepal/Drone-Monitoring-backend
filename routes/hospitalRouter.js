const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');

const Hospital = require('../models/healthFacilities');

const hospitalRouter = express.Router();

hospitalRouter.use(bodyParser.json());

success_response = (res, data) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
}

hospitalRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Hospital.find({type:'hospital'})
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.cors, (req, res, next) => {
        req.body.type = 'hospital';
        Hospital.create(req.body)
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported /hospital`);
    })
    .delete(cors.cors, (req, res, next) => {
        Hospital.remove({type:'hospital'})
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

hospitalRouter.route('/:hospitalId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Hospital.findOne({_id:req.params.hospitalId,type:'hospital'})
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported /hospital/${req.params.hospitalId}`);
    })
    .put(cors.cors, (req, res, next) => {
        req.body.type = 'hospital';
        Hospital.findOneAndUpdate({_id:req.params.hospitalId,type:'hospital'}, {
                $set: req.body
            }, {
                new: true
            }).then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.cors, (req, res, next) => {
        Hospital.findOneAndRemove({_id:req.params.hospitalId,type:'hospital'})
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = hospitalRouter;