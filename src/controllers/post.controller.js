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

exports.createPost = (req, res) => {
    const post = new Post({
        position: req.body.position,
        type: req.body.type,
        description: req.body.description,
        // company: req.body.company,
        // country: req.body.country,
        // location: req.body.location,
        // startdate: req.body.startdate,
    })
    post.save((err, post) => {
        if (err){
            res.status(500).send({ message: err});
            return;
        }
        res.send({message: "Post was succesfully created"})
    })
}