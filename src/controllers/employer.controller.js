const db = require("../models");
const Employer = db.employer;

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

exports.getEmployer = (req, res) => {
  console.log("here")
  Employer.findOne(
    { email: req.body.body.email },
    function (err, doc) {
      console.log(doc)
      if (err) return res.send(500, { error: err });
      return res.send("Employee Send");
    }
  )
};

exports.insertEmployeePosition = (req, res) => {
  Employer.findOneAndUpdate(
    { email: req.body.user.email },
    { position: req.body.user.position},
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send("Position updated successfully");
    }
  );
};

exports.insertBackdropImage = (req, res) => {
  Employer.findOneAndUpdate(
    { email: req.body.user.email },
    { backdropImage: req.body.user.backdropImage},
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send("Image updated successfully");
    }
  )
};

exports.getBackdropImage = (req, res) => {
  console.log("here")
  Employer.findOne(
    {email: req.body.user.email},
    function(err, obj) {
      if (err) return res.send(500, { error: err });
      return res.send(200, obj.backdropImage)
    }
  )
};

exports.insertProfileImage = (req, res) => {
  Employer.findOneAndUpdate(
    { email: req.body.user.email },
    { profileImage: req.body.user.profileImage},
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send("Image updated successfully");
    }
  )
};

exports.userBoard = (req, res) => {
  res.status(200).send("Logged in as User");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Logged in as Admin");
};
