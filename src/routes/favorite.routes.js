const { authJwt } = require("../middleware");
const express = require("express");
const controller = require("../controllers/favorite.controller");
const router = express.Router();

router.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


router.post("/favorite", controller.postFavorite);
router.get("/favorite", controller.getFavorite);
router.delete("/favorite/delete", controller.deleteFavorite);

module.exports = router;