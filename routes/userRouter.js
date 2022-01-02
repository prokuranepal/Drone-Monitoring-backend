const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/users');
const HealthFacilities = require('../models/healthFacilities');
const UserRole = require('../utils/utils').UserRole;

const passport = require('passport');
const authenticate = require('../authenticate');

const cors = require('./cors');
const success_response = require('./functions/success_response');

const {
  authorize
} = require('passport');

const userRouter = express.Router();

userRouter.use(bodyParser.json());

userRouter.options('*', cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
});

userRouter.route('/')
  .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin, UserRole.Hospital, UserRole.RegulatoryBody]), async (req, res, next) => {
    if (req.user.bodiesType === UserRole.SuperAdmin) {
      let query_obj = {
        bodiesType: req.query.body
      };
      user = User.find(query_obj);
      if (req.query.body === 'Hospital') {
        user = user.populate({
          path: 'bodiesId',
          select: 'name',
          model: 'HealthFacilities'
        });
      } else if (req.query.body === "Regulatory Body") {
        user = user.populate({
          path: 'bodiesId',
          select: 'name',
          model: 'RegulatoryBodies'
        });
      }
      user.then((users) => {
          success_response(res, users);
        }, (err) => next(err))
        .catch((err) => next(err));
    } else if (req.query.bodiesId) {
      let query_obj = {
        bodiesId: req.query.bodiesId
      };
      User.find(query_obj)
        .then((users) => {
          success_response(res, users);
        }, (err) => next(err))
        .catch((err) => next(err));
    } else {
      health_facilities = await HealthFacilities.getHealthPostByHospital(req.user.bodiesId);
      healthpost_user = [];
      health_facilities.forEach(async (healthpost) => {
        // healthpost_user[healthpost._id] = await User.find({healthFacilities:healthpost._id}).select("-resetPasswordToken").exec();
        healthpost_user.push(...await User.find({
          bodiesId: healthpost._id
        }).populate({
          path: "bodiesId",
          select: "name",
          model: "HealthFacilities"
        }).select("-resetPasswordToken").exec());
        success_response(res, healthpost_user);
      });
    }
  })
// .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin, UserRole.RegulatoryBody]), (req, res, next) => {
//   User.register(new User({
//     email: req.body.email,
//     phoneNumber: req.body.phoneNumber,
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//   }), req.body.password, function (err, user) {
//     if (err) {
//       res.statusCode = 500;
//       res.setHeader('Content-Type', 'application/json');
//       if (err.errmsg && (err.errmsg).includes('phoneNumber')) {
//         var phoneError = {};
//         phoneError.name = 'PhoneNumberExistsError';
//         phoneError.message = 'User with Phone number already exists';
//         return res.json({
//           err: phoneError
//         });
//       }
//       return res.json({
//         err: err
//       });
//     } else {
//       user.save((err, user) => {
//         if (err) {
//           res.statusCode = 500;
//           res.setHeader('Content-Type', 'application/json');
//           res.json({
//             err: err
//           });
//           return;
//         }
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json({
//           success: true,
//           status: 'Registration Successful'
//         });
//       });
//     }
//   });
// });

userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register(new User({
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    name: req.body.name,
  }), req.body.password, function (err, user) {
    if (err) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      if (err.errmsg && (err.errmsg).includes('phoneNumber')) {
        var phoneError = {};
        phoneError.name = 'PhoneNumberExistsError';
        phoneError.message = 'User with Phone number already exists';
        return res.json({
          err: phoneError
        });
      }
      return res.json({
        err: err
      });
    } else {
      if (req.body.bodiesType) {
        user.bodiesType = req.body.bodiesType;
      }
      if (req.body.bodiesId) {
        user.bodiesId = req.body.bodiesId;
      }
      if (req.body.department) {
        user.department = req.body.department;
      }
      if (req.body.position) {
        user.position = req.body.position;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            err: err
          });
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: true,
            status: 'Registration Successful'
          });
        });
      });
    }
  });
});

userRouter.post('/login', cors.cors, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({
        success: false,
        status: 'Login Unsuccessful',
        err: info
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({
          success: false,
          status: 'Login Unsuccessful',
          err: 'Could not log in user'
        });
      }

      var [token, refreshToken] = authenticate.getToken({
        _id: req.user._id
      });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({
        userId: user.id,
        userType: user.bodiesType,
        success: true,
        token: token,
        expiresIn: 3600,
        refreshToken: refreshToken,
        status: 'Login successful'
      });
    });
  })(req, res, next);
});

userRouter.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

userRouter.get('/checkJWTToken', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('jwt', {
    session: false
  }, (err, user, info) => {
    if (err) next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        status: 'JWT Invalid!',
        success: false,
        err: info
      });
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        status: 'JWT valid!',
        success: true,
        user: user
      });
    }
  })(req, res);
});

userRouter.post('/token', cors.corsWithOptions, (req, res, next) => {
  if (req.body.refreshToken) {
    let [cond, user] = authenticate.validateRefreshToken(req.body.refreshToken);
    if (cond) {
      var [token, refreshToken] = authenticate.getToken({
        _id: user._id
      });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({
        userId: user._id,
        userType: user.role,
        success: true,
        token: token,
        expiresIn: 3600,
        refreshToken: refreshToken,
        status: 'Login successful'
      });
    } else {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({
        err: "Please provide valid refresh token"
      })
    }

  } else {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    return res.json({
      err: "no refresh token provided"
    })
  }
})

userRouter.route('/profile')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    user_query = User.findById(req.user._id);
    if ([UserRole.Hospital, UserRole.HealthPost].includes(req.user.bodiesType)) {
      user_query = user_query.populate({
        path: 'bodiesId',
        select: 'name',
        model: 'HealthFacilities'
      });
    } else if ([UserRole.RegulatoryBody].includes(req.user.bodiesType)) {
      user_query = user_query.populate({
        path: 'bodiesId',
        select: 'name',
        model: 'RegulatoryBodies'
      });
    }
    user_query.then((user) => {
        success_response(res, user);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

userRouter.route('/:userId')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    // if (req.params.userId == req.user._id) {
    //   User.findById(req.params.userId)
    //     .then((user) => {
    //       success_response(res, user);
    //     });
    // }else {
    let healthFacilites_list = [];
    await HealthFacilities.findOne({
        _id: req.user.bodiesId,
        type: "Hospital"
      })
      .then(async (hospital) => {
        healthFacilites_list.push((hospital._id).toString());
        let healthFacilities = await HealthFacilities.getHealthPostByHospital(hospital._id);
        healthFacilities.forEach((healthFacility) => {
          healthFacilites_list.push((healthFacility._id).toString());
        })
      })
    User.findById(req.params.userId)
      .populate({
        path: 'healthFacilities',
        select: "name"
      })
      .then((user) => {
        let cond = healthFacilites_list.includes((user.healthFacilities).toString());
        if (cond) {
          success_response(res, user);
        } else {
          success_response(res, user);
        }
      })
    // }
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported /users/${req.params.userId}`);
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    if (req.params.userId == req.user._id || req.user.bodiesType == UserRole.SuperAdmin) {
      User.findById(req.params.userId)
        .then((user) => {
          if (req.body.name) {
            user.name = req.body.name;
          }
          if (req.body.department) {
            user.department = req.body.department;
          }
          if (req.body.position) {
            user.position = req.body.position;
          }
          if (req.body.email) {
            user.email = req.body.email;
          }
          user.save();
          success_response(res, user);
        })
    } else {
      let healthFacilites_list = [];
      await HealthFacilities.findOne({
          _id: req.user.bodiesId,
          type: "Hospital"
        })
        .then(async (hospital) => {
          healthFacilites_list.push((hospital._id).toString());
          let healthFacilities = await HealthFacilities.getHealthPostByHospital(hospital._id);
          healthFacilities.forEach((healthFacility) => {
            healthFacilites_list.push((healthFacility._id).toString());
          })
        })
      User.findById(req.params.userId)
        .then((user) => {
          let cond = healthFacilites_list.includes((user.bodiesId).toString());
          if (cond) {
            if (req.body.name) {
              user.name = req.body.name;
            }
            if (req.body.department) {
              user.department = req.body.department;
            }
            if (req.body.position) {
              user.position = req.body.position;
            }
            if (req.body.email) {
              user.email = req.body.email;
            }
            let cond1 = healthFacilites_list.includes((req.body.bodiesId).toString())
            if (cond1) {
              user.bodiesId = req.body.bodiesId;
            }
            user.save();
            success_response(res, user);
          }
        })
    }
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.checkIsInRoles([UserRole.SuperAdmin]), async (req, res, next) => {
    if (req.user.bodiesType == UserRole.SuperAdmin) {
      User.findById(req.params.userId)
        .then((user) => {
          user.remove();
          success_response(res, user);
        })
    } else {
      let healthFacilites_list = [];
      await HealthFacilities.findOne({
          _id: req.user.bodiesId,
          type: "Hospital"
        })
        .then(async (hospital) => {
          healthFacilites_list.push((hospital._id).toString());
          let healthFacilities = await HealthFacilities.getHealthPostByHospital(hospital._id);
          healthFacilities.forEach((healthFacility) => {
            healthFacilites_list.push((healthFacility._id).toString());
          })
        })
      User.findById(req.params.userId)
        .then((user) => {
          if (user) {
            let cond = healthFacilites_list.includes((user.healthFacilities).toString());
            if (cond) {
              user.deleteOne();
              success_response(res, user);
            }
          } else {
            success_response(res, {
              status: 403,
              message: "User cannot be found"
            });
          }
        })
        .catch((err) => next(err));
    }
  })


module.exports = userRouter;