const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const sendMail = require('./mail');
const db = require('./config/database');
const passport = require('passport');
const app = express();

//handlebars helpers
const { formatDate, countOrder } = require('./helpers/hbs');

//Load order route
const order = require('./routes/order');
const user = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;
//connecting to mongodb
mongoose.connect(db.mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB connected..'))
  .catch(err => console.log(err));

//express-handlebars middleware
app.engine('handlebars', exphbs({
  helpers: { 
    formatDate: formatDate,
    countOrder: countOrder
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Data parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method override middleware
app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//Passport middleware, always put it under the express session middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware
app.use(flash());

//Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


//Static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/fa', express.static(__dirname + '/node_modules/font-awesome/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/font-awesome/fonts'));

//home route
app.get('/', (req, res) => {
  res.render('index');
});


app.post('/email', (req, res) => {
  //send mail here
  const { email, subject, text } = req.body;
  console.log('Data: ', req.body);
  sendMail(email, subject, text, (err, data) => {
    if(err){
      res.status(500).json({ message: 'Internal error' });
    } else {
      res.json({ message: 'Email sent!!' });
    }
  });
});

//user route
app.use('/orders', order);
app.use('/', order);
app.use('/users', user);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});