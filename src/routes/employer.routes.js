const { authJwt } = require("../middleware");
const express = require("express");
const controller = require("../controllers/employer.controller");
const router = express.Router();
const multer = require("multer");
const path = require("path")

const upload = multer({ dest: path.join(__dirname, '.') })

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/test/all", controller.allAccess);

router.get("/employers", controller.getEmployers);

router.get("/test/user", [authJwt.verifyToken], controller.userBoard);

router.put("/employers", [authJwt.verifyToken], controller.insertEmployeePosition)

router.put ("/employersBackdropImg", [authJwt.verifyToken],  upload.any(), controller.insertBackdropImage)
router.put ("/employersProfileImg", [authJwt.verifyToken], upload.any(), controller.insertProfileImage)

router.get ("/employersBackdropImg/:backdropImageID", [authJwt.verifyToken], controller.getBackdropImage)
router.get ("/employersProfileImg/:profileImageID", [authJwt.verifyToken], controller.getProfileImage)

router.get ("/employer/:email", [authJwt.verifyToken], controller.getEmployer)

router.put("/employerDescription", [authJwt.verifyToken], controller.setEmployerDescription)
router.put("/employerUpdateEmail", [authJwt.verifyToken], controller.updateEmail)
router.put("/employerUpdatePassword", [authJwt.verifyToken], controller.updatePassword)

router.get(
  "/test/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.adminBoard
);

module.exports = router;
