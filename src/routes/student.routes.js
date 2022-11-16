const multer = require("multer");
const { authJwt } = require("../middleware");
const path = require("path")
const express = require("express");
const controller = require("../controllers/student.controller");
const router = express.Router();

const upload = multer({ dest: path.join(__dirname, '.') })

  router.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/students", controller.getStudents)
  
  router.post('/pdfUpload', upload.any(), controller.importPDF)

  router.get ('/pdfCV/:studentID', controller.getPDFFileName)
  
  router.get ('/pdfCVDownload/:downloadID', controller.getPDFDownload)

  router.put ("/studentBackdropImg", [authJwt.verifyToken],  upload.any(), controller.insertBackdropImage)
  router.put ("/studentProfileImg", [authJwt.verifyToken], upload.any(), controller.insertProfileImage)

  router.get ("/studentBackdropImg/:backdropImageID", [authJwt.verifyToken], controller.getBackdropImage)
  router.get ("/studentProfileImg/:profileImageID", [authJwt.verifyToken], controller.getProfileImage)

  router.get ("/student/:studentID", [authJwt.verifyToken], controller.getStudent)

  router.put("/studentName", [authJwt.verifyToken], controller.setStudentName)
  router.put("/studentDescription", [authJwt.verifyToken], controller.setStudentDescription)
  router.put("/studentUpdateEmail", [authJwt.verifyToken], controller.updateEmail)

  module.exports = router;
