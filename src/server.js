//Source https://hevodata.com/learn/building-a-secure-node-js-rest-api/

require("dotenv").config();

const mongoose = require("mongoose");

const express = require("express");
const apiRouter = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const modelContainer = require("./models");
const Role = modelContainer.role;
const Feedback = modelContainer.feedback;
const app = express();

const __user = process.env.MONGO_INITDB_ROOT_USERNAME;
const __password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const __host = process.env.MONGO_INITDB_HOST;
console.log(__user, __password, __host);
mongoose
  .connect(
    `mongodb://${__user}:${__password}@${__host}/admin`,
    //"mongodb://localhost:27017/admin",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initialConfiguration();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

var corsOptions = {
  origin: "http://localhost:3001",
};

app.use(cors(corsOptions));

app.use(helmet());

app.use(bodyParser.json());

app.use(morgan("combined"));

app.use(express.urlencoded({ extended: true }));

app.use(express.static("./public"));

app.use("/api", apiRouter);

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
