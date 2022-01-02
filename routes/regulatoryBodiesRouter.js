const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const UserRole = require('../utils/utils').UserRole;

const authenticate = require('../authenticate');
const cors = require('./cors');
const success_response = require('./functions/success_response');

const RegulatoryBodies = require('../models/regulatoryBodies');

const regulatoryBodiesRouter = express.Router();

regulatoryBodiesRouter.use(bodyParser.json());


regulatoryBodiesRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        RegulatoryBodies.find()
            .then((regulatoryBodies) => {
                success_response(res, regulatoryBodies);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        RegulatoryBodies.create(req.body)
            .then((regulatoryBodies) => {
                success_response(res, regulatoryBodies);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported /regulatoryBodies`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        RegulatoryBodies.remove()
            .then((regulatoryBodies) => {
                success_response(res, regulatoryBodies);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

regulatoryBodiesRouter.route('/:regulatoryBodiesId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin, UserRole.RegulatoryBody]), (req, res, next) => {
        RegulatoryBodies.findOne({
                _id: req.params.regulatoryBodiesId,
            })
            .then((regulatoryBodies) => {
                success_response(res, regulatoryBodies);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported /regulatoryBodies/${req.params.regulatoryBodiesId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        RegulatoryBodies.findOneAndUpdate({
                _id: req.params.regulatoryBodiesId,
            }, {
                $set: req.body
            }, {
                new: true
            }).then((regulatoryBodies) => {
                success_response(res, regulatoryBodies);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        RegulatoryBodies.findOneAndRemove({
                _id: req.params.regulatoryBodiesId,
            })
            .then((regulatoryBodies) => {
                success_response(res, regulatoryBodies);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = regulatoryBodiesRouter;