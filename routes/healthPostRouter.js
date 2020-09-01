const Healthpost = require('../models/healthFacilities');
const cors = require('./cors');
const express = require('express');
const healthPostRouter = express.Router();
const bodyparser = require('body-parser');
const success_response = require('./functions/success_response');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

healthPostRouter.use(bodyparser.json());

healthPostRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Healthpost.find({
        type: 'healthpost',
        hospital: req.user.healthFacilities
      }).select("-employee -medicine")
      .then((healthPost) => {
        success_response(res, healthPost);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    req.body.type = 'healthpost';
    req.body.healthpost = [];
    Healthpost.create(req.body)
      .then((healthPost) => {
        success_response(res, healthPost);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Healthpost.remove({
        type: 'healthpost'
      })
      .then((healthPost) => {
        message = {
          status: true,
          message: 'Successfully deleted'
        };
        success_response(res, message);
      }, (err) => next(err))
      .catch((err) => next(err));
  });


healthPostRouter.route('/:healthpostId')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Healthpost.findOne({
        _id: req.params.healthpostId,
        type: 'healthpost'
      })
      .populate('medicine')
      .then((healthPost) => {
        success_response(res, healthPost);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    req.body.type = 'healthpost';
    req.body.healthpost = [];
    Healthpost.findOneAndUpdate({_id:req.params.healthpostId,type:'healthpost'}, {
        $set: req.body
      }, {
        new: true
      })
      .then((healthPost) => {
        success_response(res, healthPost);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Healthpost.findOneAndRemove({_id:req.params.healthpostId,type:'healthpost'})
      .then((healthPost) => {
        message = {
          status: true,
          message: 'Successfully deleted'
        };
        success_response(res, message);
      }, (err) => next(err))
      .catch((err) => next(err));
  });



module.exports = healthPostRouter;