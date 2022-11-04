const db = require("../models");
const Post = db.post;

exports.getPosts = (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).send(posts);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.createPost = (req, res) => {
  const post = new Post({
    description: req.body.description,
    type: req.body.type,
    company: req.body.company,
    location: req.body.location,
    // contact: req.body.contact,
    // email: req.body.email,
    // phone: req.body.phone,
  });
  post.save((err, post) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "Post was succesfully created" });
  });
};
