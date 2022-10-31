const { verifySignUp } = require("../middleware");
const express = require("express");
const controller = require("../controllers/auth.controller");
const router = express.Router();

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post(
  "/auth/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  controller.employerSignup
);

router.post("/auth/signin", controller.employerSignin);

router.post("/auth/refreshtoken", controller.refreshToken);

router.post("/auth/studentsignin", controller.studentSignin);

module.exports = router;
