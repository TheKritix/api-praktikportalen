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


router.post("/feedback", controller.postFeedback);
router.get("/feedback", controller.getFeedback);
router.delete("/feedback/delete", controller.deleteFeedback);

module.exports = router;