const mongoose = require("mongoose");

const postsSchema = {
    position: String,
    type: String,
    description: String,
    //company: String,
    // country: String,
    // location: String,
    // startdate: String
};

module.exports = Object.freeze({
    postsSchema,
});