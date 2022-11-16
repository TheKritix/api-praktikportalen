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
        title: req.body.title,
        type: req.body.type,
        company: req.body.company,
        location: req.body.location,
        startdate: req.body.startdate,
        description: req.body.description,
        contact: req.body.contact,
        applyToEmail: req.body.applyToEmail,
        website: req.body.website,
        //bannerImg: req.body.bannerImg,
        // compensation: req.body.compensation,
        // hasApplied: req.body.hasApplied,
        // benefits: req.body.benefits,
    })
    post.save((err, post) => {
        if (err){
            res.status(500).send({ message: err});
            return;
        }
        res.send({message: "Post was succesfully created"})
    })
}