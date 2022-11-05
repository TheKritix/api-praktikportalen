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


  module.exports = router;
