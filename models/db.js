const mongoose = require('mongoose');

const config = require('../config');
const env_variable = process.env.NODE_ENV;

let  url = config.mongoUrl;
let message = "Connected correctly to server";

if (env_variable === 'test') {
  url = config.mongoTestUrl;
  message = "Connected correclty to test server";
}

const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

connect.then((db) => {
  console.log(message);
}, (err) => {
  console.log(err);
})

module.exports = connect;