const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    postedAt: String,
    text: String,
    ratingOutOfFive: String,
    internshipId: String
})

module.exports = Object.freeze({
    feedbackSchema,
})