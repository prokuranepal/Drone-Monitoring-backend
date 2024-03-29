const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const UserRole = require('../utils/utils').UserRole;

const authenticate = require('../authenticate');
const cors = require('./cors');
const success_response = require('./functions/success_response');

const Hospital = require('../models/healthFacilities');

const hospitalRouter = express.Router();

hospitalRouter.use(bodyParser.json());


hospitalRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin, UserRole.RegulatoryBody]), (req, res, next) => {
        Hospital.find({
                type: 'Hospital'
            })
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        req.body.type = 'Hospital';
        Hospital.create(req.body)
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported /hospital`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Hospital.remove({
                type: 'Hospital'
            })
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

hospitalRouter.route('/:hospitalId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin, UserRole.RegulatoryBody]), (req, res, next) => {
        Hospital.findOne({
                _id: req.params.hospitalId,
                type: 'Hospital'
            })
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported /hospital/${req.params.hospitalId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        req.body.type = 'Hospital';
        Hospital.findOneAndUpdate({
                _id: req.params.hospitalId,
                type: 'Hospital'
            }, {
                $set: req.body
            }, {
                new: true
            }).then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Hospital.findOneAndRemove({
                _id: req.params.hospitalId,
                type: 'Hospital'
            })
            .then((hospital) => {
                success_response(res, hospital);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = hospitalRouter;