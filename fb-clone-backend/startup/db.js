const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");

module.exports = function () {
  var  mongourl = config.get("mongoUri");
  mongoose.connect(mongourl)
    .then(() => {
      console.log(`Connected to ${mongourl}`);
      winston.info("Connected to Database");
    })
    .catch((err) => {
      console.log(err.message);
    });
};
