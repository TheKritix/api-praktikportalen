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

exports.userBoard = (req, res) => {
  res.status(200).send("Logged in as User");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Logged in as Admin");
};
