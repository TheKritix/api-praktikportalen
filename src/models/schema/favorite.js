const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema({
    studentID: String,
    favorites: [String]
})

module.exports = Object.freeze({
    favoriteSchema,
})