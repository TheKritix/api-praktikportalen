module.exports = {
  secret: "praktikportal-secret-key",
  jwtExpiration: 36000, // 1 hour
  jwtRefreshExpiration: 86400, // 24 hours

  // testing
  //jwtExpiration: 6000, // 1 minute
  //jwtRefreshExpiration: 12000, // 2 minutes
};
