const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const app = express();

//handlebars helpers
const { formatDate } = require('./helpers/dateFormat');

//Load route
const message = require('./routes/message');
const order = require('./routes/order');


//Load message model
require('./models/Message');
const Message = mongoose.model('messages');

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;
//connecting to mongodb
mongoose.connect('mongodb://localhost/triogeneration-dev', {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB connected..'))
  .catch(err => console.log(err));

//express-handlebars middleware
app.engine('handlebars', exphbs({
  helpers: {formatDate: formatDate}, 
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//connect flash middleware
app.use(flash());

//Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//Static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/fa', express.static(__dirname + '/node_modules/font-awesome/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/font-awesome/fonts'));

//home route
app.get('/', (req, res) => {
  Message.find({})
  .sort({date:'desc'})
  .then(messages => {
    res.render('index', {
      messages: messages
    });
  });
});

//use routes
app.use('/', message);
app.use('/', order);

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});