const mongoose = require("mongoose");
const schema = require("./schema/feedback.js");


const Feedback = mongoose.model("Feedback", schema.feedbackSchema);

module.exports = Feedback;
