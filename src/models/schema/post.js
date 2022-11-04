const mongoose = require("mongoose");

const postsSchema = {
  position: String,
  type: String,
  company: String,
  location: String,
  startdate: String,
  description: String,
};

module.exports = Object.freeze({
  postsSchema,
});
