const db = require("../models");
const Employer = db.employer;
const fs = require("fs");
const GridFile = db.gridFile;
const path = require("path");
var bcrypt = require("bcryptjs");

exports.allAccess = (req, res) => {
  res.status(200).send("All Access");
};

exports.getEmployers = (req, res) => {
  Employer.find()
    .then((employers) => {
      res.status(200).send(employers);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.setEmployerDescription = (req, res) => {
  Employer.findOneAndUpdate(
    { email: req.body.email },
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

exports.getEmployer = (req, res) => {
  Employer.findOne({ email: req.params.email }, function (err, doc) {
    if (err) {
      return res.status(500).send({ message: err });
    }

    const token = req.headers["x-access-token"];
    const refreshToken = req.headers["x-refresh-token"];

    const employer = {
      id: doc._id,
      username: doc.username,
      email: doc.email,
      name: doc.name,
      companyName: doc.companyName,
      roles: doc.roles,
      accessToken: token,
      refreshToken: refreshToken,
      position: doc.position,
      backdropImageID: doc.backdropImageID,
      profileImageID: doc.profileImageID,
      description: doc.description
    };

    res.send(employer);
  });
};

exports.insertEmployeePosition = (req, res) => {
  Employer.findOneAndUpdate(
    { email: req.body.email },
    { position: req.body.position },
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send("Position updated successfully");
    }
  );
};

exports.updateEmail = (req, res) => {
  Employer.findOneAndUpdate(
    { username: req.body.username},
    { email: req.body.email },
    { upsert: true},
    function (err) {
      if (err) {
        return res.status(500).send({ message: err });
      } else {
        return res.status(200).send({ message: "Student email updated" });
      }
    }
  )
}

exports.updatePassword = (req, res) => {
  Employer.findOneAndUpdate(
    { username: req.body.username},
    { password: bcrypt.hashSync(req.body.password, 8) },
    { upsert: true},
    function (err) {
      if (err) {
        return res.status(500).send({ message: err });
      } else {
        return res.status(200).send({ message: "Student password updated" });
      }
    }
  )
}

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

        const email = req.files[0].fieldname;
        Employer.findOneAndUpdate(
          { email: email },
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
            if (err) {
            }
            fs.unlink(filePath, (err) => {
            });
          });
        });
      } else {
        // file not found
        res.status(404).json({ error: "file not found" });
      }
    }
  } catch (err) {
    console.log("No backdrop image found");
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

        const email = req.files[0].fieldname;
        Employer.findOneAndUpdate(
          { email: email },
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
            if (err) {
              console.log;
            }
            fs.unlink(filePath, (err) => {
            });
          });
        });
      } else {
        // file not found
        res.status(404).json({ error: "file not found" });
      }
    }
  } catch (err) {
    console.log("No profile image found");
  }
};

exports.userBoard = (req, res) => {
  res.status(200).send("Logged in as User");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Logged in as Admin");
};
