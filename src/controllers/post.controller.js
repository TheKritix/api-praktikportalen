const db = require("../models");
const Post = db.post;
const fs = require("fs");
const GridFile = db.gridFile;
const path = require("path");

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
        bannerImageID: req.body.bannerImageID,
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

    exports.insertBannerImage = async (req, res) => {
        console.log("hey")
        try {
            if (req.files) {
                const promises = req.files.map(async (file) => {
                    const fileStream = fs.createReadStream(file.path);

                    //upload file to gridfs
                    const gridFile = new gridFile({ filename: file.originalname });
                    await gridFile.upload(fileStream);

                    // delete the file from local folder
                    fs.unlinkSync(file.path);

                    //fix så den finder rigtige id
                    const title = req.files[0].fieldname;
                    Post.findOneAndUpdate(
                       { title: title },
                       { bannerImageID: gridFile._id },
                       { upsert: true },
                       function (err, doc) {
                        if (err) {
                            console.log(err);
                        }
                       }
                    );
                });

                await Promise.all(promises);
            }
            res.sendStatus(201);
        } catch (err) {
            console.log(err);
        }
    };

    exports.getBannerImage = async (req, res) => {
        try {
            if (req.params) {
                const id = req.params.bannerImageID;

                const gridFile = await GridFile.findById(id);

                const fileName = gridFile._id + gridFile.filename;
                const filePath = path.join(__dirname, fileName);

                if (gridFile) {
                    const fileStream = fs.createWriteStream(filePath);

                    res.set("Content-Type", "image/jpeg");
                    res.set(
                        "Content-Disposition",
                        'attachment; filename="' + fileName + '"'
                    );

                    await gridFile.download(fileStream, (err) => {
                        res.sendFile(filePath, function (err) {
                            fs.unlink(filePath, (err) => {
                                console.log("File deleted");
                            });
                        });
                    });
                } else {
                    //file not found
                    res.status(404).json({ error: "file not found" });
                }
            }
        } catch (err) {
            console.log(err);
        }
    };
}