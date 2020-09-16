const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config');
const refreshTokens = {};
exports.local = passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    const access_token = jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
    const refresh_token = jwt.sign(user, config.refreshSecretKey, {
        expiresIn: 4000
    });
    refreshTokens[refresh_token] = user;
    return [access_token, refresh_token];
};

exports.validateRefreshToken = function (refreshToken) {
    let cond = refreshToken in refreshTokens;
    if (cond) {
        user = refreshTokens[refreshToken];
    } else {
        user = null;
    }
    return [cond, user];
}
var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;
opts.passReqToCallback = true;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (req, jwt_payload, done) => {
    var expirationDate = new Date(jwt_payload.exp * 1000);
    if (expirationDate < new Date()) {
        return done(null, false);
    }
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