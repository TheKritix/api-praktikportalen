const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema({
    uid: String,
    favorite: String
})

module.exports = Object.freeze({
    favoriteSchema,
})