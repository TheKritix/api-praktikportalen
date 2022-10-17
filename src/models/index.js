const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.employer = require("./employer.model");
db.role = require("./role.model");

db.ROLES = ["user", "admin"];

module.exports = db;
