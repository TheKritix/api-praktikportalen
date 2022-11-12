const mongoose = require("mongoose");

const roleSchema = {
  name: String,
};

const employerSchema = {
  username: String,
  name: String,
  email: String,
  password: String,
  companyName: String,
  position: String,
  backdropImageID: String,
  profileImageID: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],

};

const studentSchema = {
  studentID: String,
  name: String,
  email: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  pdfFileID: String,
  // role: String,

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
