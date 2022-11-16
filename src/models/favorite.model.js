const mongoose = require("mongoose");
const schema = require("./schema/favorite.js");

const Favorite = mongoose.model("Favorite", schema.favoriteSchema);

module.exports = Favorite;
