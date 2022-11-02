const db = require("../models");
const Student = db.student;

exports.getStudent = (req, res) => {
    Student.findOne({})
}