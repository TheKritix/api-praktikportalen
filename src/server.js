//Source https://hevodata.com/learn/building-a-secure-node-js-rest-api/

const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const apiRouter = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./models");
const dbConfig = require("./config/db.config");
const Role = db.role;

const app = express();

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initialConfiguration();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.use(helmet());

app.use(bodyParser.json());

app.use(morgan("combined"));

app.use(express.urlencoded({ extended: true }));

app.use(express.static("./public"));

//app.use("/api", apiRouter);

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

app.listen(process.env.PORT || "3000", () => {
  console.log(`it be doing something on port ${process.env.PORT || "3000"}`);
});

function initialConfiguration() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}
