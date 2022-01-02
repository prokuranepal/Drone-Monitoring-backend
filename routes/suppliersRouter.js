const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const UserRole = require('../utils/utils').UserRole;

const authenticate = require('../authenticate');

const cors = require('./cors');

const Suppliers = require('../models/suppliers');
const suppliersRouter = express.Router();

const success_response = require('./functions/success_response');
suppliersRouter.use(bodyparser.json());


suppliersRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Suppliers.find({})
            .then((supplier) => {
                success_response(res, supplier);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Suppliers.create(req.body)
            .then((supplier) => {
                success_response(res, supplier);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Suppliers.remove({})
            .then((supplier) => {
                message = {
                    status: true,
                    message: 'Successfully deleted'
                };
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

suppliersRouter.route('/:suppliersId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Suppliers.findById({
                _id: req.params.suppliersId
            })
            .then((supplier) => {
                success_response(res, supplier);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Suppliers.findByIdAndUpdate(req.params.suppliersId, {
                $set: req.body
            }, {
                new: true
            })
            .then((modifiedData) => {
                success_response(res, modifiedData);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
        Suppliers.deleteOne({
                _id: req.params.suppliersId
            })
            .then((supplier) => {
                message = {
                    status: true,
                    message: 'Successfully deleted'
                };
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = suppliersRouter;