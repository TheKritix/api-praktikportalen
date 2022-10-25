const mongoose = require("mongoose");

const postsSchema = {
    title: String,
    type: String,
    companyName: String,
    // location: String,
    // contact: String,
    // email: String,
    // phone: String,
};

module.exports = Object.freeze({
    postsSchema,
});