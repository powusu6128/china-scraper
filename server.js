//dependencies
var express = require('express');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
// var favicon = require('serve-favicon');


//initializing the app
var app = express();

//setting up the database connection
const config = require('./config/database');
mongoose.Promise = Promise;
mongoose
  .connect(config.database)
  .then(result => {
    console.log(`Connected to database '${result.connections[0].name}' on ${result.connections[0].host}:${result.connections[0].port}`);
  })
  .catch(err => console.log('There was an error with your connection:', err));


//setting up Morgan middleware
app.use(logger('dev'));

//setting up body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//setting up handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//setting up the static directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/articles', express.static(path.join(__dirname, 'public')));
app.use('/notes', express.static(path.join(__dirname, 'public')));

//setting up routes
var index = require('./controllers/index');
var article = require('./controllers/article');
var note = require('./controllers/note');
var scrape = require('./controllers/scrape');

app.use('/', index);
app.use('/articles', article);
app.use('/notes', note);
app.use('/scrape', scrape);

//starting server
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`Listening on http://localhost:${PORT}`);
});