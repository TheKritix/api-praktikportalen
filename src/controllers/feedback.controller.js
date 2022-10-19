const db = require("../models");
const Feedback = db.feedback;


exports.postFeedback = (req, res) => {
    const post = new Feedback({
        username: req.body.firstName,
        lastName: req.body.lastName,
        postedAt: req.body.postedAt,
        text: req.body.text,
        ratingOutOfFive: req.body.ratingOutOfFive
    })
    post.save((err, post) => {
        if (err){
            res.status(500).send({ message: err });
            return;
        }
        
        res.send({message: "Feedback was succesfully saved"});

    });
};