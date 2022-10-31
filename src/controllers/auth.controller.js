const config = require("../config/auth.config.js");
const db = require("../models");
const Employer = db.employer;
const Student = db.student;
const Role = db.role;
const RefreshToken = db.refreshToken;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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
        studentSignup(req, res);
        this.studentSignin(req, res);
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

/* Employer Auth */
exports.employerSignup = (req, res) => {
  const employer = new Employer({
    username: req.body.username,
    email: req.body.email,
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
      res.status(200).send({
        id: employer._id,
        username: employer.username,
        email: employer.email,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken,
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
