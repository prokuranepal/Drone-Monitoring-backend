const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');

const DMSEvent = require('../models/event');
const success_response = require('./functions/success_response');

const dmseventRouter = express.Router();

dmseventRouter.use(bodyParser.json());

dmseventRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        DMSEvent.find({}).sort({
                createdAt: -1
            }).limit(20)
            .then((dmsevent) => {
                success_response(res, dmsevent);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        DMSEvent.create(req.body)
            .then((dmsevent) => {
                success_response(res, dmsevent);

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported /dmsevent`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        DMSEvent.remove({})
            .then((dmsevent) => {
                let message = {
                    msg: 'Successfully Deleted',
                    status: 'OK'
                };
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

dmseventRouter.route('/:dmseventId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        DMSEvent.findById(req.params.dmseventId)
            .then((dmsevent) => {
                success_response(res, dmsevent);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported /dmsevent/${req.params.dmseventId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        DMSEvent.findByIdAndUpdate(req.params.dmseventId, {
                $set: req.body
            }, {
                new: true
            }).then((dmsevent) => {
                success_response(res, dmsevent);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        DMSEvent.findByIdAndRemove(req.params.dmseventId)
            .then((dmsevent) => {
                let message = {
                    msg: 'Successfully Deleted',
                    status: 'OK'
                };
                success_response(res, message);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = dmseventRouter;