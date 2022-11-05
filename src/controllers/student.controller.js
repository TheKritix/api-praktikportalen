const db = require("../models");
const Student = db.student;
const fs = require("fs");
const GridFile = db.gridFile;
const async = require("async");

exports.getStudents = (req, res) => {
  Student.find()
    .then((students) => {
      res.status(200).send(students);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

//Source: https://abskmj.github.io/notes/posts/express/express-multer-mongoose-gridfile/
exports.importPDF = async (req, res) => {
  try {
    if (req.files) {
      const promises = req.files.map(async (file) => {
        const fileStream = fs.createReadStream(file.path);

        // upload file to gridfs
        const gridFile = new GridFile({ filename: file.originalname });
        await gridFile.upload(fileStream);

        // delete the file from local folder
        fs.unlinkSync(file.path);

        const studentID = req.files[0].fieldname;
        Student.findOneAndUpdate(
          { studentID: studentID },
          { pdfFileID: gridFile._id },
          { upsert: true },
          function (err, doc) {
            if (err) {
              console.log(err);
            }
          }
        );
      });

      await Promise.all(promises);
    }
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
  }
};

//Source: http://caolan.github.io/async/v3/
exports.getPDFFileName = (req, res) => {
  try {
    if (req.params) {
      async.waterfall(
        [
          function getPdfId(done) {
            Student.findOne({ studentID: req.params.studentID })
              .lean()
              .exec(done);
          },
          function getPDFName(student, done) {
            GridFile.findById(student.pdfFileID).lean().exec(done);
          },
        ],
        function (err, casts) {
          if (err) {
            console.log(err);
          }
          res.json(casts)
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

// Source: https://abskmj.github.io/notes/posts/express/express-multer-mongoose-gridfile/
// Det her skal kodes lidt om, så vi ikke skal afvente på et ID.. 
exports.getPDFDownload = async (req, res) => {
  try {
    if (req.params) {
      const id = req.params.downloadID
      console.log(req.params)

      const gridFile = await GridFile.findById(id)
  
      if (gridFile) {
        res.attachment(id+".pdf")
        gridFile.downloadStream(res)
      } else {
        // file not found
        res.status(404).json({ error: 'file not found' })
      }
    }
  } catch (err) {
    console.log(err);
  }
};
