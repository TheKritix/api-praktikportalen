const mongoose = require("mongoose");

const roleSchema = {
  name: String,
};

const employerSchema = {
  username: String,
  email: String,
  password: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  // role: String,
  // name: String,
  // phone: String,
  // company: String,
  // companyPhone: String,
  // companyEmail: String,
  // companyAddress: String,
  // companyZip: String,
  // companyCity: String,
  // companyCVR: String,
  // companyWebsite: String,
  // companyDescription: String,
  // companyLogo: String,
  // companyContactPerson: String,
  // companyContactPersonPhone: String,
  // companyContactPersonEmail: String,
  // companyContactPersonPosition: String,
  // companyContactPersonDescription: String,
};

const studentSchema = {
  email: String,
  password: String,
  name: String,
  // role: String,
  studentID: String,
  // phone: String,
  // studentSemester: String,
  // studentClass: String,
  // studentEducation: String,
  // studentEducationStart: String,
  // studentEducationEnd: String,
  // studentEducationDescription: String,
  // studentEducationProfileImage: String,
  // studentEducationWebsite: String,
  // studentEducationAddress: String,
  // studentEducationZip: String,
  // studentEducationCity: String,
  // studentEducationContactPerson: String,
  // studentEducationContactPersonPhone: String,
  // studentEducationContactPersonEmail: String,
  // studentEducationContactPersonPosition: String,
  // studentEducationContactPersonDescription: String,
  // studentEducationContactPersonLogo: String,
  // studentEducationContactPersonWebsite: String,
  // studentEducationContactPersonAddress: String,
  // studentEducationContactPersonZip: String,
  // studentEducationContactPersonCity: String,
};

module.exports = Object.freeze({
  roleSchema,
  employerSchema,
  studentSchema,
});
