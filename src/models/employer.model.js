const mongoose = require("mongoose");
const schema = require("./schema/login.js");

const Employer = mongoose.model("Employer", schema.employerSchema);

module.exports = Employer;
