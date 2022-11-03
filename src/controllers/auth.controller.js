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

exports.studentLogin = async (req, res) => {
  const { data } = await axios.get("https://auth.dtu.dk/dtu/servicevalidate", {
    params: {
      service: "http://localhost:3001/dtu-praktikportalen",
      ticket: req.body.ticket,
    },
  });
  const output = xml2js.xml2js(data, { compact: false, spaces: 4 });
  if (req.body.ticket) {
    const studentEmail =
      output.elements[0].elements[0].elements[1].elements[0].elements[1]
        .elements[0].text;
    const studentID =
      output.elements[0].elements[0].elements[0].elements[0].text;
    const studentName =
      output.elements[0].elements[0].elements[1].elements[0].elements[4]
        .elements[0].text;

    Student.findOne({
      where: {
        studentID: studentID,
      },
    })
      .populate("roles", "-__v")
      .exec(async (err, student) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (!student) {
          await Student.create({
            studentID: studentID,
            name: studentName,
            email: studentEmail,
          }).then(async (student) => {
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
                  student.roles = roles.map((role) => role._id);
                  student.save((err) => {
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    }
                    //res.send({ message: "Student was registered successfully!" });
                  });
                }
              );
            } else {
              Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
                student.roles = [role._id];
                student.save((err) => {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }
                  //res.send({ message: "Student was registered successfully!" });
                });
              });
            }
            const newStudent = await student;
            console.log(newStudent.id);
            console.log("Student created: ", newStudent);
            signIn(newStudent.studentID, res);
          });
          //const login = await studentLogin(req, res) ;

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
        console.log("Roless" + authorities);
        console.log("token" + token);
        console.log("refreshToken" + refreshToken);
        res.status(200).send({
          id: student._id,
          studentID: student.studentID,
          name: student.name,
          email: student.email,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
        });
      });
  }
};

exports.studentSignin = (req, res) => {
  Student.findOne({
    studentID: req.body.studentID,
  })
    .populate("roles", "-__v")
    .exec(async (err, student) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      console.log(student);
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
      });
    });
};

const studentSignup = (req, res) => {
  const student = new Student({
    studentID: req.body.studentID,
    name: req.body.name,
    email: req.body.email,
  });

  student.save((err, student) => {
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

          student.roles = roles.map((role) => role._id);
          student.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            //res.send({ message: "Student was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        student.roles = [role._id];
        student.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          //res.send({ message: "Student was registered successfully!" });
        });
      });
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

      var token = jwt.sign({ id: employer.id }, config.secret, {
        expiresIn: config.jwtExpiration, // 24 hours
      });

      let refreshToken = await RefreshToken.createToken(employer);

      var authorities = [];

      for (let i = 0; i < employer.roles.length; i++) {
        authorities.push("ROLE_" + employer.roles[i].name.toUpperCase());
      }
      console.log(employer)
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
        backdropImage: employer.backdropImage,
        profileImage: employer.profileImage
      });
    });
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
