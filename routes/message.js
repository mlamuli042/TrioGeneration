const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Message');
const Message = mongoose.model('messages');

//add message
router.post('/', (req, res) => {
  let errors = [];

  if (!req.body.name) {
    errors.push({ text: 'Please enter your name' });
  } if (!req.body.email) {
    errors.push({ text: 'Please enter email' });
  } if (!req.body.message) {
    errors.push({ text: 'Please enter your message' });
  } if (errors.length > 0) {
    res.render('index', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    });
  } else {
    const newMessage = {
      name: req.body.name,
      email: req.body.email,
      details: req.body.message
    }

    new Message(newMessage)
      .save()
      .then(message => {
        req.flash('success_msg', 'Message successfully added.');
        res.redirect('/');
      });
  }

});

module.exports = router;