const config = require("../config/auth.config.js");
const db = require("../models");
const Employer = db.employer;
const Student = db.student;
const Role = db.role;
const RefreshToken = db.refreshToken;
const axios = require("axios");
const xml2js = require("xml-js");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
require("dotenv").config();
global.stuID = "";
global.stuName = "";
global.stuEmail = "";
// Source: DTU CAS Dokumentation
// https://docs.google.com/document/d/12HXLyYZ_Xmigt9Jy4UcKTGTwomE6HxiN/edit?usp=sharing&ouid=100718859747511911046&rtpof=true&sd=true
exports.studentSignin = async (req, res) => {
  const { data } = await axios.get("https://auth.dtu.dk/dtu/servicevalidate", {
    params: {
      service: process.env.SERVICE,
      ticket: req.body.ticket,
    },
  });
  //https://www.npmjs.com/package/xml-js
  const output = xml2js.xml2js(data, { compact: false, spaces: 4 });
  console.log("SignIn data length" + data.length);
  console.log("SignIn data" + data);
  if (data.length > 700 && req.body.ticket) {
    const studentEmail =
      output.elements[0].elements[0].elements[1].elements[0].elements[1]
        .elements[0].text;
    const studentID =
      output.elements[0].elements[0].elements[0].elements[0].text;
    const studentName =
      output.elements[0].elements[0].elements[1].elements[0].elements[4]
        .elements[0].text;
    stuID = studentID;
    stuName = studentName;
    stuEmail = studentEmail;
    console.log(studentEmail);

    Student.findOne({
      studentID: studentID,
    })
      .populate("roles", "-__v")
      .exec(async (err, student) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (!student) {
          this.studentSignup(stuID, stuName, stuEmail).then(() => {
            signIn(stuID, res);
          });
          return;
        }
        var token = jwt.sign({ id: student.id }, config.secret, {
          expiresIn: config.jwtExpiration,
        });

        let refreshToken = await RefreshToken.createToken(student);

        var authorities = [];

        for (let i = 0; i < student.roles.length; i++) {
          authorities.push("ROLE_" + student.roles[i].name.toUpperCase());
        }
        console.log(student);
        res.status(200).send({
          id: student._id,
          studentID: student.studentID,
          name: student.name,
          email: student.email,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
          backdropImageID: student.backdropImageID,
          profileImageID: student.profileImageID,
          description: student.description,
        });
      });
  } else {
    res.status(500).send({ message: "Invalid Ticket" });
  }
};

exports.studentSignup = async (studentID, studentName, studentEmail) => {
  console.log(studentEmail);

  const student = new Student({
    studentID: studentID,
    name: studentName,
    email: studentEmail,
  });

  student.save((err, student) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  });
};

const signIn = (studentID, res) => {
  Student.findOne({
    studentID: studentID,
  })
    .populate("roles", "-__v")
    .exec(async (err, student) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      console.log("signIn Function " + student);
      if (student == null) {
        return res.status(404).send({ message: "User Not found." });
      }
      var token = jwt.sign({ id: student.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(student);
      var authorities = [];
      for (let i = 0; i < student.roles.length; i++) {
        authorities.push("ROLE_" + student.roles[i].name.toUpperCase());
      }

      console.log("Roless" + authorities);
      res.status(200).send({
        id: student._id,
        studentID: student.studentID,
        name: student.name,
        email: student.email,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken,
        backdropImageID: student.backdropImageID,
        profileImageID: student.profileImageID,
        description: student.description,
      });
    });
};

/* Employer Auth */
exports.employerSignup = (req, res) => {
  const employer = new Employer({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    companyName: req.body.companyName,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  employer.save((err, employer) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          employer.roles = roles.map((role) => role._id);
          employer.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        employer.roles = [role._id];
        employer.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "Employer was registered successfully!" });
        });
      });
    }
  });
};

exports.employerSignin = (req, res) => {
  Employer.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec(async (err, employer) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!employer) {
        return res.status(404).send({ message: "User Not found." });
      }
      // Source: https://www.npmjs.com/package/bcryptjs
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        employer.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      // Source: https://www.npmjs.com/package/jsonwebtoken
      var token = jwt.sign({ id: employer.id }, config.secret, {
        expiresIn: config.jwtExpiration, // 24 hours
      });

      let refreshToken = await RefreshToken.createToken(employer);

      var authorities = [];

      for (let i = 0; i < employer.roles.length; i++) {
        authorities.push("ROLE_" + employer.roles[i].name.toUpperCase());
      }
      console.log(employer);
      res.status(200).send({
        id: employer._id,
        username: employer.username,
        email: employer.email,
        name: employer.name,
        companyName: employer.companyName,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken,
        position: employer.position,
        backdropImageID: employer.backdropImageID,
        profileImageID: employer.profileImageID,
        description: employer.description,
      });
    });
};
exports.checkToken = (req, res) => {
  console.log("checkAccessToken");
  res.status(200).send({ message: "Valid Token" });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      config.secret,
      {
        expiresIn: config.jwtExpiration,
      }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
