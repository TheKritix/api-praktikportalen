const { authJwt } = require("../middleware");
const express = require("express");
const controller = require("../controllers/feedback.controller");
const router = express.Router();

router.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


router.post("/postFeedback", controller.postFeedback);

module.exports = router;