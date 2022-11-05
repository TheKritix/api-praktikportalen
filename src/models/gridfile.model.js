//source: https://abskmj.github.io/notes/posts/express/express-multer-mongoose-gridfile/

const mongoose = require("mongoose");
const schema = require("gridfile");

module.exports = mongoose.model("GridFile", schema);
