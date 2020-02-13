const express = require('express');
const bycrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const { ensureAuthenticated, allowUserReg } = require('../helpers/hbs');
const mongoose = require('mongoose');

//Load user model
require('../models/User');
const User = mongoose.model('users');

router.get('/login', (req, res) => {
  let userFound;
  User.find({})
  .then(userFound => {
      res.render('users/login', {
        userFound: userFound
    });
  });
});

//Login form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/orders',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/register', allowUserReg, (req, res) => {
  res.render('users/register');
});

//User registration
router.post('/register', (req, res) => {
  let errors = [];

  if (!req.body.name) {
    errors.push({ text: 'Please enter your name' });
  } if (!req.body.email) {
    errors.push({ text: 'Please enter your email' });
  } if (!req.body.password) {
    errors.push({ text: 'Please enter your password' });
  } if (!req.body.confirm_password) {
    errors.push({ text: 'Please confirm your password' });
  } if (req.body.password !== req.body.confirm_password) {
    errors.push({ text: 'Two passwords do not match' });
  } if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email
    });
  } else {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }
    //check for email duplication
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          //bycrypt user password
          bycrypt.genSalt(10, (err, salt) => {
            bycrypt.hash(newUser.password, salt, (err, hash) => {
              newUser.password = hash;
              if (err) throw err;
              else {
                new User(newUser)
                  .save()
                  .then(user => {
                    req.flash('success_msg', 'Welcome ' + req.body.name + ' you are now admin');
                    res.redirect('/users/login');
                  })
              }
            });
          });
        } else {
          req.flash('error_msg', 'Email already registered');
          res.redirect('/users/register');
        }
      });
  }

});

//User profile route
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('users/profile');
});

//Change password route
router.put('/profile', ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.newPassword) {
    errors.push({ text: 'Please enter new password' });
  } if (!req.body.confirmNewPassword) {
    errors.push({ text: 'Please confirm new password' });
  } if (req.body.newPassword !== req.body.confirmNewPassword) {
    errors.push({ text: 'Two new passwords do not match' });
  } if (errors.length > 0) {
    res.render('users/profile', {
      errors: errors
    });
  } else {
    User.findOne({ _id: req.user.id })
      .then(user => {
        user.password = req.body.newPassword;

        //hash the new password
        bycrypt.genSalt(10, (err, salt) => {
          bycrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;

            //Save new hashed password to database
            user.save()
              .then(user => {
                req.flash('success_msg', 'New password is set, use your new passowrd on your next login');
                res.redirect('/users/profile');
              });
          });
        });
      });
  }
});

//remove account route
router.delete('/profile', (req, res) => {
  User.deleteOne({ _id: req.user.id })
    .then(() => {
      req.flash('success_msg', 'Account removed');
      res.redirect('/users/login');
    });
});

//Logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;