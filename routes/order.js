const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Order');
const Order = mongoose.model('order');

router.post('/about', (req, res) => {
  let errors = [];

  if (!req.body.name) {
    errors.push({ text: 'Enter your name' });
  } if (!req.body.email) {
    errors.push({ text: 'Enter your email address' });
  } if (!req.body.phone) {
    errors.push({ text: 'Enter your phone number' });
  } if (!req.body.color) {
    errors.push({ text: 'Enter your favourite color' });
  } if (req.body.size === 'Choose your size') {
    errors.push({ text: 'Choose your size' });
  } if (errors.length > 0) {
    res.render('about', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      color: req.body.color,
      size: req.body.size
    });
  } else {
    const newOrder = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      color: req.body.color,
      size: req.body.size
    }

    // new Order(newOrder)
    //   .save()
    //   .then(order => {

    //   })
    console.log(req.body);
    
  }
});

module.exports = router;