const db = require("../models");
const Feedback = db.feedback;


exports.postFeedback = (req, res) => {
    const post = new Feedback({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        postedAt: req.body.postedAt,
        text: req.body.text,
        ratingOutOfFive: req.body.ratingOutOfFive,
        internshipId: req.body.internshipId
    })
    post.save((err, post) => {
        if (err){
            res.status(500).send({ message: err });
            return;
        }
        
        res.send({message: "Feedback was succesfully saved"});

    });
};


exports.getFeedback = (req, res) => {
    Feedback.find()
        .then((feedback) => {
            res.status(200).send(feedback);
        })
        .catch((err) => {
            res.status(500).send({message: err.message});
        })
};


exports.deleteFeedback = (req, res) => {
    Feedback.findOne({
        _id: req.body._id
    }).remove((err) => {
        if (err){
            res.status(500).send({message: err});
        }
        res.send({message: "Feedback was successfully deleted"})
    })
}