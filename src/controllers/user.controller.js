exports.allAccess = (req, res) => {
  res.status(200).send("All Access");
};

exports.userBoard = (req, res) => {
  res.status(200).send("Logged in as User");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Logged in as Admin");
};
