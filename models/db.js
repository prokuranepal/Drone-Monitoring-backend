const mongoose = require('mongoose');

const config = require('../config');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => {
  console.log(err);
});

module.exports = connect;