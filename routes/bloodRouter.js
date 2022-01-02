const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const UserRole = require('../utils/utils').UserRole;

const Blood = require('../models/blood');
const bloodRouter = express.Router();
const success_response = require('./functions/success_response');

bloodRouter.use(bodyparser.json());

bloodRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions,authenticate.verifyUser,authenticate.checkIsInRoles([UserRole.SuperAdmin, UserRole.RegulatoryBody]), (req, res, next) => {
    if (req.query.bloodGroup) {
      Blood.find({
          bloodGroup: req.query.bloodGroup
        })
        .populate('healthfacilities')
        .then((blood) => {
          success_response(res, blood);
        }, (err) => next(err))
        .catch((err) => next(err));
    } else {
      Blood.find({})
        .populate('healthfacilities')
        .then((blood) => {
          success_response(res, blood);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
  })
  .post(cors.corsWithOptions,authenticate.verifyUser,authenticate.checkIsInRoles([UserRole.SuperAdmin, UserRole.RegulatoryBody]), (req, res, next) => {
    Blood.create(req.body)
      .then((blood) => {
        success_response(res, blood);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.checkIsInRoles([UserRole.SuperAdmin, UserRole.RegulatoryBody]), (req, res, next) => {
    if (req.query.bloodGroup) {
      Blood.remove({
          bloodGroup: req.query.bloodGroup
        })
        .then((blood) => {
          message = {
            status: true,
            message: 'Successfully deleted'
          };
          success_response(res, message);
        }, (err) => next(err))
        .catch((err) => next(err));
    } else {
      Blood.remove({})
        .then((blood) => {
          message = {
            status: true,
            message: 'Successfully deleted'
          };
          success_response(res, message);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
  });

bloodRouter.route('/:bloodId')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions,authenticate.verifyUser,authenticate.checkIsInRoles([UserRole.SuperAdmin, UserRole.RegulatoryBody]), (req, res, next) => {
    Blood.findOne({
        _id: req.params.bloodId
      })
      .populate('healthfacilities')
      .then((blood) => {
        success_response(res, blood);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.checkIsInRoles([UserRole.SuperAdmin, UserRole.RegulatoryBody]), (req, res, next) => {
    Blood.findByIdAndUpdate(req.params.bloodId, {
        $set: req.body
      }, {
        new: true
      })
      .then((blood) => {
        success_response(res, blood)
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.checkIsInRoles([UserRole.SuperAdmin, UserRole.RegulatoryBody]), (req, res, next) => {
    Blood.findByIdAndRemove(req.params.bloodId)
      .then((blood) => {
        message = {
          status: true,
          message: 'Successfully deleted'
        };
        success_response(res, message);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = bloodRouter;