const db = require("../models");
const Student = db.student;
const fs = require("fs");
const GridFile = db.gridFile;
const async = require("async");
const path = require("path");

exports.getStudents = (req, res) => {
  Student.find()
    .then((students) => {
      res.status(200).send(students);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.setStudentName = (req, res) => {
  Student.findOneAndUpdate(
    { studentID: req.body.studentID },
    { name: req.body.name },
    { upsert: true },
    function (err) {
      if (err) {
        return res.status(500).send({ message: err });
      } else {
        return res.status(200).send({ message: "Student name updated" });
      }
    }
  );
};

exports.setStudentDescription = (req, res) => {
  Student.findOneAndUpdate(
    { studentID: req.body.studentID },
    { description: req.body.description },
    { upsert: true },
    function (err) {
      if (err) {
        return res.status(500).send({ message: err });
      } else {
        return res.status(200).send({ message: "Student name updated" });
      }
    }
  );
};

exports.getStudent = (req, res) => {
  Student.findOne({ studentID: req.params.studentID }, function (err, doc) {
    if (err) {
      return res.status(500).send({ message: err });
    }
    const token = req.headers["x-access-token"];
    const refreshToken = req.headers["x-refresh-token"];

    const student = {
      id: doc._id,
      studentID: doc.studentID,
      name: doc.name,
      email: doc.email,
      roles: doc.roles,
      accessToken: token,
      refreshToken: refreshToken,
      backdropImageID: doc.backdropImageID,
      profileImageID: doc.profileImageID,
      description: doc.description
    };


    res.send(student);
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
            if (student) {
              GridFile.findById(student.pdfFileID).lean().exec(done);
            }
          },
        ],
        function (err, casts) {
          if (err) {
            console.log(err);
          }
          res.json(casts);
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
      const id = req.params.downloadID;

      const gridFile = await GridFile.findById(id);

      if (gridFile) {
        res.attachment(id + ".pdf");
        gridFile.downloadStream(res);
      } else {
        // file not found
        res.status(404).json({ error: "file not found" });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.insertBackdropImage = async (req, res) => {
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
          { backdropImageID: gridFile._id },
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

exports.getBackdropImage = async (req, res) => {
  try {
    if (req.params) {
      const id = req.params.backdropImageID;

      const gridFile = await GridFile.findById(id);


      const fileName = gridFile._id + gridFile.filename;
      const filePath = path.join(__dirname, fileName);

      if (gridFile) {
        const fileStream = fs.createWriteStream(filePath);

        res.set("Content-Type", "image/jpeg");
        res.set(
          "Content-Disposition",
          'attachment; filename="' + fileName + '"'
        );

        await gridFile.download(fileStream, (err) => {
          res.sendFile(filePath, function (err) {
            fs.unlink(filePath, (err) => {
              console.log("File deleted");
            });
          });
        });
      } else {
        // file not found
        res.status(404).json({ error: "file not found" });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.insertProfileImage = async (req, res) => {
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
          { profileImageID: gridFile._id },
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

exports.getProfileImage = async (req, res) => {
  try {
    if (req.params) {
      const id = req.params.profileImageID;
      const gridFile = await GridFile.findById(id);


      const fileName = gridFile._id + gridFile.filename;
      const filePath = path.join(__dirname, fileName);

      if (gridFile) {
        const fileStream = fs.createWriteStream(filePath);

        res.set("Content-Type", "image/jpeg");
        res.set(
          "Content-Disposition",
          'attachment; filename="' + fileName + '"'
        );

        await gridFile.download(fileStream, (err) => {
          res.sendFile(filePath, function (err) {
            fs.unlink(filePath, (err) => {
              console.log("File deleted");
            });
          });
        });
      } else {
        // file not found
        res.status(404).json({ error: "file not found" });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
