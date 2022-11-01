const express = require("express");
const router = express.Router();

router.use("/", require("./auth.routes"));
router.use("/", require("./employer.routes"));
router.use("/", require("./feedback.routes"));
router.use("/", require("./post.routes"));

module.exports = router;
