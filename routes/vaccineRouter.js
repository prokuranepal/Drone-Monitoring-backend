const express = require('express');
const bodyparser = require('body-parser');
const cors = require('./cors');
const Vaccine = require('../models/vaccine');
const UserRole = require('../utils/utils').UserRole;

const vaccineRouter = express.Router();

const mongoose = require('mongoose');
const authenticate = require('../authenticate');
vaccineRouter.use(bodyparser.json());

const success_response = require('./functions/success_response');

vaccineRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Vaccine.find({})
            .populate('healthfacilities')
            .then((vaccine) => {
                success_response(res, vaccine);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Vaccine.create(req.body)
            .then((vaccine) => {
                success_response(res, vaccine);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Vaccine.remove({})
            .then((vaccine) => {
                message = {
                    status: true,
                    message: 'Successfully deleted'
                };
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

vaccineRouter.route('/:vaccineId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Vaccine.findOne({
                _id: req.params.vaccineId
            })
            .populate('healthfacilities')
            .then((vaccine) => {
                success_response(res, vaccine);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Vaccine.findByIdAndUpdate(req.params.vaccineId, {
                $set: req.body
            }, {
                new: true
            })
            .then((vaccine) => {
                success_response(res, vaccine);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Vaccine.findByIdAndRemove(req.params.vaccineId)
            .then((vaccine) => {
                message = {
                    status: true,
                    message: 'Successfully deleted'
                };
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = vaccineRouter;