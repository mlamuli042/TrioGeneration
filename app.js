const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const sendMail = require('./mail');
const app = express();
let errors = [];

//handlebars helpers
const { formatDate } = require('./helpers/dateFormat');

//Load route

//Load message model
require('./models/Message');
const Message = mongoose.model('messages');

//Load message model
require('./models/Order');
const Order = mongoose.model('order');


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
  helpers: { formatDate: formatDate },
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
    .sort({ date: 'desc' })
    .then(messages => {
      res.render('index', {
        messages: messages
      });
    });
});


//add message route
// app.post('/', (req, res) => {
//   let errors = [];

//   if (!req.body.name) {
//     errors.push({ text: 'Please enter your name' });
//   } if (!req.body.email) {
//     errors.push({ text: 'Please enter email' });
//   } if (!req.body.message) {
//     errors.push({ text: 'Please enter your message' });
//   } if (errors.length > 0) {
//     res.render('index', {
//       errors: errors,
//       name: req.body.name,
//       email: req.body.email,
//       message: req.body.message
//     });
//   } else {
//     const newMessage = {
//       name: req.body.name,
//       email: req.body.email,
//       details: req.body.message
//     }

//     new Message(newMessage)
//       .save()
//       .then(message => {
//         req.flash('success_msg', 'Message successfully added.');
//         res.redirect('/');
//       });
//   }

// });


//make order route
app.post('/', (req, res) => {

  if (!req.body.orderName) {
    errors.push({ text: 'Enter your name' });
  } if (!req.body.orderEmail) {
    errors.push({ text: 'Enter your email address' });
  } if (!req.body.phone) {
    errors.push({ text: 'Enter your phone number' });
  } if (isNaN(req.body.phone)) {
    errors.push({ text: 'You entered an invalid phone number' });
  } if (req.body.phone.length < 8) {
    errors.push({ text: 'You entered an invalid phone number' });
  } if (!req.body.color) {
    errors.push({ text: 'Enter your favourite color' });
  } if (req.body.size === 'Choose your size') {
    errors.push({ text: 'Choose your size' });
  } if (errors.length > 0) {
    res.render('index', {
      errors: errors,
      name: req.body.orderName,
      email: req.body.orderEmail,
      phone: req.body.phone,
      color: req.body.color,
      size: req.body.size
    });
  } else {
    const newOrder = {
      name: req.body.orderName,
      email: req.body.orderEmail,
      phone: req.body.phone,
      address: req.body.address,
      color: req.body.color,
      size: req.body.size
    }

    new Order(newOrder)
      .save()
      .then(order => {
        req.flash('success_msg', 'Order is successfully made. We will contact you soon.');
        res.redirect('/');
      })
    


  }
});

app.post('/email', (req, res) => {
  //send mail here
  const { email, subject, text } = req.body;
  console.log('Data: ', req.body);
  sendMail(email, subject, text, function (err, data) {
    if (err) {
      res.status.json({ mesage: 'Internal error' });
    } else {
      res.json({ message: 'Email sent!!' });
    }
  });

});


const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});