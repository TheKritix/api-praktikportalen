module.exports = Object.freeze({
  employer: require("./employer.model.js"),
  //student: require("./student.model.js"),
  role: require("./role.model.js"),
  refreshToken: require("./refreshToken.model.js"),
  ROLES: ["user", "admin"],
});
