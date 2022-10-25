const mongoose = require("mongoose");
const schema = require("./schema/post.js");

const Post = mongoose.model("Post", schema.postsSchema);

module.exports = Post;