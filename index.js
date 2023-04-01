const express = require('express');
const path = require('path')
const app = express();
const morgan  = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const errorHandler = require('./helpers/error-handler');
app.use("/css",express.static("./node_modules/bootstrap/dist/css"));
app.use("/js",express.static("./node_modules/bootstrap/dist/js"));
app.use("/",express.static("./node_modules/bootstrap/dist/"));
app.use("/icons",express.static("./node_modules/bootstrap-icons/font/"));

//pozyskiwanie zmiennych srodowiskowych
require('dotenv/config');
app.set('view engine', 'ejs');
// app.use(cors());
// app.options('*', cors());

//Routes
const viewsRouter = require('./routes/views');

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Routers
app.use(`/`, viewsRouter);

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    dbName: 'eshop-database'
}
).then(() => {
console.log('Database connection is ready');
}) .catch(() => {
console.log('error');
})

app.get('/', (req, res) => {
    res.send('hello MVC');
});

app.listen(9000, () => {
    console.log('server is running on localhost:9000');
});