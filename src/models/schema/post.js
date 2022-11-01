const mongoose = require("mongoose");

const postsSchema = {
    title: String,
    description: String,
    type: String,
    company: String,
    location: String,
    compensation: Boolean,
    hasApplied: Boolean,
    benefits: [String],
    // contact: String,
    // email: String,
    // phone: String,
};

module.exports = Object.freeze({
    postsSchema,
});