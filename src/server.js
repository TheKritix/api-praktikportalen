//Source https://hevodata.com/learn/building-a-secure-node-js-rest-api/

require("dotenv").config();
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
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

Sentry.init({
  dsn: "https://d379325516ec46c0b965a639d93a1474@o4504161998798848.ingest.sentry.io/4504162013085696",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const __user = process.env.MONGO_INITDB_ROOT_USERNAME;
const __password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const __host = process.env.MONGO_INITDB_HOST;

const mongoDBUri = `mongodb://${__user}:${__password}@${__host}/admin`;

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.get("/", function rootHandler(req, res) {
  res.end("Root endpoint");
});

app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

mongoose
  .connect(
    mongoDBUri,
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
  origin: "https://dtu.praktikportal.diplomportal.dk",
};

var whitelist = ["https://dtu.praktikportal.diplomportal.dk", "http://localhost:3001"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(helmet());

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.use(
  bodyParser.json({
    limit: "50mb",
    extended: true,
  })
);

app.use(morgan("combined"));

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
