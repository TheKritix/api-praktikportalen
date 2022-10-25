const db = require("../models");
const Post = db.post;

exports.getPosts = (req, res) => {
    Post.find()
    .then((posts) => {
        res.status(200).send(posts);
    })
    .catch((err) => {
        res.status(500).send({ message: err.message});
    });
}