const multer = require("multer");
const { authJwt } = require("../middleware");
const path = require("path");
const express = require("express");
const controller = require("../controllers/post.controller");
const router = express.Router();

const upload = multer({ dest: path.join(__dirname, '.') })

router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.get("/post", controller.getPosts)
router.post("/post", controller.createPost)

router.put ("/bannerImage", upload.any(), controller.insertBannerImage)
router.get ("/bannerImage/:bannerImageID", controller.getBackdropImage)

module.exports = router; 