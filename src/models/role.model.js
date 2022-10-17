const mongoose = require("mongoose");
const schema = require("./schema/login.js");

const Role = mongoose.model("Role", schema.roleSchema);

module.exports = Role;
