//Source https://hevodata.com/learn/building-a-secure-node-js-rest-api/

const mongoose = require ('mongoose');
require("dotenv").config();

const __user = process.env.MONGO_INITDB_ROOT_USERNAME;
const __password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const __host = process.env.MONGO_INITDB_HOST;

mongoose.connect(`mongodb://${__user}:${__password}@${__host}.dtu.praktikportal.diplomportal.dk:6543/admin`, {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const express = require ('express')
const apiRouter = require('./routes')
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(helmet())

app.use(bodyParser.json())

app.use(cors());

app.use(morgan('combined'));

app.use(express.urlencoded({ extended: true}))

app.use(express.static("./public"))

app.use('/api', apiRouter)

app.listen(process.env.PORT || '3000', () => {

    console.log(`it be doing something on port ${process.env.PORT || '3000'}`)

}); 

app.get("/test", function(req, res){
    res.render("employerlogins");
});

