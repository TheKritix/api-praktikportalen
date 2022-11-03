const mongoose = require('mongoose');
const schema = require('./schema/login.js');

const Student = mongoose.model('Student', schema.studentSchema);

module.exports = Student;