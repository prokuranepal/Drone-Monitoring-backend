const express = require('express');
const cors = require('cors');
const config = require('../config')

const app = express();

const whitelist = config.whitelist;

const corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true
        };
    } else {
        corsOptions = {
            origin: false
        };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);