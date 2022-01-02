const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');
const UserRole = require('../utils/utils').UserRole;

const Mission = require('../models/mission');
const success_response = require('./functions/success_response');

const missionRouter = express.Router();

missionRouter.use(bodyParser.json());

missionRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
        Mission.find({
                hospital: req.user.bodiesId
            })
            .populate({
                path: "hospital",
                select: "name location"
            })
            .populate({
                path: "destination",
                select: "name location"
            })
            .select("-waypoints")
            .then((missions) => {
                success_response(res, missions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
        req.body.hospital = req.user.bodiesId;
        req.body.wb = (req.body.waypoints).length;
        Mission.create(req.body)
            .then((missions) => {
                success_response(res, missions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported /mission`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
        Mission.remove({
                hospital: req.user.bodiesId
            })
            .then((missions) => {
                let message = {
                    msg: 'Successfully Deleted',
                    status: 'OK'
                };
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

missionRouter.route('/:missionId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
        Mission.findById(req.params.missionId)
            .populate({
                path: "hospital",
                select: "name location"
            })
            .populate({
                path: "destination",
                select: "name location"
            })
            .then((mission) => {
                success_response(res, mission);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported /mission/${req.params.missionId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
        req.body.hospital = req.user.bodiesId;
        Mission.findByIdAndUpdate(req.params.missionId, {
                $set: req.body
            }, {
                new: true
            }).then((mission) => {
                success_response(res, mission);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
        Mission.findByIdAndRemove(req.params.missionId)
            .then((mission) => {
                let message = {
                    msg: 'Successfully Deleted',
                    status: 'OK'
                };
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = missionRouter;