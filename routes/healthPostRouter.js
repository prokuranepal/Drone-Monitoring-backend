const Healthpost = require('../models/healthFacilities');
const cors = require('./cors');
const express = require('express');
const UserRole = require('../utils/utils').UserRole;
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
  .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
    Healthpost.find({
        type: 'Health Post',
        hospital: req.user.bodiesId
      }).select("-employee -medicine")
      .then((healthPost) => {
        success_response(res, healthPost);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
    req.body.type = 'Health Post';
    req.body.hospital = req.user.bodiesId;
    req.body.healthpost = [];
    Healthpost.create(req.body)
      .then((healthPost) => {
        success_response(res, healthPost);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
    Healthpost.remove({
        type: 'Health Post'
      })
      .then((healthPost) => {
        message = {
          status: 'OK',
          msg: 'Successfully Deleted'
        };
        success_response(res, message);
      }, (err) => next(err))
      .catch((err) => next(err));
  });


healthPostRouter.route('/:healthpostId')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
    Healthpost.findOne({
        _id: req.params.healthpostId,
        type: 'Health Post'
      })
      .populate('medicine')
      .then((healthPost) => {
        success_response(res, healthPost);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
    req.body.type = 'Health Post';
    req.body.healthpost = [];
    Healthpost.findByIdAndUpdate({
        _id: req.params.healthpostId,
        type: 'Health Post'
      }, {
        $set: req.body
      }, {
        new: true
      })
      .then((healthPost) => {
        success_response(res, healthPost);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.Hospital]), (req, res, next) => {
    Healthpost.deleteOne({
        _id: req.params.healthpostId,
        type: 'Health Post'
      })
      .then((result) => {
        if (result.n === 0) {
          res.sendStatus(404);
        } else {
          message = {
            status: 'OK',
            msg: 'Successfully Deleted'
          };
          success_response(res, message);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  });


module.exports = healthPostRouter;