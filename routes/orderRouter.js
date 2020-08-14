const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Orders = require('../models/orders');

const orderRouter = express.Router();
const success_response = require('./functions/success_response');

orderRouter.use(bodyparser.json());

orderRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, (req, res, next) => {
        Orders.find({})
            .populate('created_User')
            .populate('orderItem.medicine')
            .then((order) => {
                success_response(res, order);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        Orders.create(req.body)
            .then((order) => {
                success_response(res, order);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, (req, res, next) => {
        Orders.remove({})
            .then((order) => {
                message = {
                    status: true,
                    message: 'Successfully deleted'
                };
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

orderRouter.route('/:orderId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, (req, res, next) => {
        Orders.findOne({
                _id: req.params.orderId
            })
            .populate('created_User')
            .populate('orderItem.medicine')
            .then((order) => {
                success_response(res, order);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.cors, (req, res, next) => {
        Orders.findByIdAndUpdate(req.params.orderId, {
                $set: req.body
            }, {
                new: true
            })
            .then((orderResult) => {
                success_response(res, orderResult);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.cors, (req, res, next) => {
        Orders.findByIdAndRemove(req.params.orderId)
            .then((order) => {
                message = {
                    status: true,
                    message: 'Successfully deleted'
                };
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

orderRouter.route('/:orderId/cancel')
    .post(cors.corsWithOptions, (req, res, next) => {
        const order = Orders.findById(req.params.orderId)
            .then((order) => {
                if (!order) {
                    res.status(404).send();
                }
                order.status = 'cancel';
                order.save();
                success_response(res, order);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = orderRouter;