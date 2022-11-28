const db = require("../models");
const Favorite = db.favorite;


exports.postFavorite = (req, res) => {
    const post = new Favorite({
        uid: req.body.uid,
        favorite: req.body.favorite
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
    console.log(req.body)
    console.log(req.body)
    Favorite.findOneAndDelete(
        {uid: req.body.uid, favorite: req.body.favorite}, function(err, docs) {
            if (err) {
                console.log(err)
                res.status(500).send({message: err})
            } else {
                res.send({message: "Favorite was successfully deleted"})
            }
        }
    )
}
