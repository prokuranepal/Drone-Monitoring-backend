module.exports = function (io) {
    const express = require('express');
    const bodyparser = require('body-parser');
    const mongoose = require('mongoose');
    const authenticate = require('../authenticate');
    const cors = require('./cors');
    const socket_notification = require('../socket/notificationmessage');
    const UserRole = require('../utils/utils').UserRole;

    const Orders = require('../models/orders');
    const HealthFacilities = require('../models/healthFacilities');

    const orderRouter = express.Router();
    const success_response = require('./functions/success_response');
    const {
        update
    } = require('../models/healthFacilities');

    orderRouter.use(bodyparser.json());

    orderRouter.route('/')
        .options(cors.corsWithOptions, (req, res) => {
            res.sendStatus(200);
        })
        .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), async (req, res, next) => {
            var healthfacilities = await HealthFacilities.findById(req.user.bodiesId).exec();
            var query_object = {};
            if (healthfacilities.type == "Hospital") {
                query_object.destination = req.user.bodiesId;
            } else {
                query_object.origin = req.user.bodiesId;
            }
            Orders.find(query_object).select('-orderItem').sort('-createdAt')
                .populate({
                    path: 'origin',
                    select: "name location"
                })
                .populate({
                    path: 'destination',
                    select: "name location"
                })
                .then((order) => {
                    success_response(res, order);
                }, (err) => next(err))
                .catch((err) => next(err));
        })
        .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), async (req, res, next) => {
            req.body.destination = await HealthFacilities.getHospitalByHealthpost(req.user.bodiesId);
            req.body.origin = req.user.bodiesId;
            req.body.user = req.user;
            Orders.create(req.body)
                .then((order) => {
                    socket_notification(io, `Order has been created by ${req.user.bodiesId}`, 1);
                    success_response(res, order);
                }, (err) => {
                    next(err)
                })
                .catch((err) => {
                    next(err)
                });
        })
        .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
            Orders.remove({})
                .then((order) => {
                    message = {
                        status: 'OK',
                        msg: 'Successfully Deleted'
                    };
                    success_response(res, message);
                }, (err) => next(err))
                .catch((err) => next(err));
        });

    orderRouter.route('/:orderId')
        .options(cors.corsWithOptions, (req, res) => {
            res.sendStatus(200);
        })
        .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
            Orders.findOne({
                    _id: req.params.orderId
                })
                .populate({
                    path: 'origin',
                    select: "name location"
                })
                .populate({
                    path: 'destination',
                    select: "name location"
                })
                .populate('orderItem.medicine')
                .then((order) => {
                    success_response(res, order);
                }, (err) => next(err))
                .catch((err) => next(err));
        })
        .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
            var update_value = {};
            if (req.body.status) {
                update_value.status = req.body.status;
            }
            if (req.body.orderLifeCycle) {
                update_value.orderLifeCycle = req.body.orderLifeCycle;
            }
            Orders.findByIdAndUpdate(req.params.orderId,
                    update_value, {
                        new: true
                    })
                .then((orderResult) => {
                    success_response(res, orderResult);
                }, (err) => next(err))
                .catch((err) => next(err));
        })
        .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
            Orders.findByIdAndRemove(req.params.orderId)
                .then((order) => {
                    let message = {
                        status: 'OK',
                        msg: 'Successfully Deleted'
                    };
                    success_response(res, message);
                }, (err) => next(err))
                .catch((err) => next(err));
        });

    orderRouter.route('/:orderId/cancel')
        .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), (req, res, next) => {
            const order = Orders.findById(req.params.orderId)
                .then((order) => {
                    order.status = 'cancelled';
                    order.save();
                    success_response(res, order);
                }, (err) => next(err))
                .catch((err) => next(err));
        });

    return orderRouter;
    // module.exports = orderRouter;
}