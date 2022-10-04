//Source https://hevodata.com/learn/building-a-secure-node-js-rest-api/

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