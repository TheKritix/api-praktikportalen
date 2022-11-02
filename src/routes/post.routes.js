const { authJwt } = require("../middleware");
const express = require("express");
const controller = require("../controllers/post.controller");
const router = express.Router();

router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.get("/post", controller.getPosts)
router.post("/post", controller.createPost)

module.exports = router; 