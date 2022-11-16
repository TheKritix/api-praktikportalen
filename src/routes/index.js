const express = require("express");
const router = express.Router();

router.use("/", require("./auth.routes"));
router.use("/", require("./employer.routes"));
router.use("/", require("./feedback.routes"));
router.use("/", require("./post.routes"));
router.use("/", require("./student.routes"));
router.use("/", require("./favorite.routes"));

module.exports = router;
