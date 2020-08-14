const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

var config = require('./config');
// var refreshTokens = {};
exports.local = passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    var access_token = jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
    // var expirytime = 3600;
    // var refresh_token = jwt.sign(user, config.refreshSecretKey, {
    //     expiresIn: 4000
    // });
    // refreshTokens[refresh_token] = user;
    return access_token;
};

var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;
opts.passReqToCallback = true;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (req, jwt_payload, done) => {
    // var expirationDate = new Date(jwt_payload.exp * 1000);
    // if (expirationDate < new Date()) {
    //     return done(null, false);
    // }
    User.findOne({
        _id: jwt_payload._id
    }, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

exports.verifyUser = passport.authenticate('jwt', {
    session: false
});