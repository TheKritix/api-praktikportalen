const mongoose = require("mongoose");

const postsSchema = {
    position: String,
    type: String,
    company: String,
    location: String,
    startdate: String,
    description: String,
    contact: String,
    applyToEmail: String,
    website: String,
    compensation: Boolean,
    hasApplied: Boolean,
    benefits: [String],
};

module.exports = Object.freeze({
    postsSchema,
});