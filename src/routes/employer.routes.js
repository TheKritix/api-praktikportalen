const { authJwt } = require("../middleware");
const express = require("express");
const controller = require("../controllers/employer.controller");
const router = express.Router();

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/test/all", controller.allAccess);

router.get("/test/user", [authJwt.verifyToken], controller.userBoard);

router.get(
  "/test/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.adminBoard
);

module.exports = router;
