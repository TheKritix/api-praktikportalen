const db = require("../models");
const Favorite = db.favorite;


exports.postFavorite = (req, res) => {
    const post = new Favorite({
        favorites: req.body.favorites
    })
    post.save((err, post) => {
        if (err){
            res.status(500).send({ message: err });
            return;
        }
        
        res.send({message: "Favorite was succesfully saved"});

    });
};


exports.getFavorite = (req, res) => {
    Favorite.find()
        .then((favorite) => {
            res.status(200).send(favorite);
        })
        .catch((err) => {
            res.status(500).send({message: err.message});
        })
};


exports.deleteFavorite = (req, res) => {
    Favorite.findOne({
        _id: req.body._id
    }).remove((err) => {
        if (err){
            res.status(500).send({message: err});
        }
        res.send({message: "Favorite was successfully deleted"})
    })
}