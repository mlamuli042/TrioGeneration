const moment = require('moment');
const mongoose = require('mongoose');

//Bring order model
require('../models/Order');
const Order = mongoose.model('order');

//Bring user model
require('../models/User');
const User = mongoose.model('users');


module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Access denied! Authorization required');
    res.redirect('/users/login');
  },
  allowUserReg: function (req, res, next) {
    User.countDocuments({}, (err, count) => {
      if (count > 0) {
        req.flash('error_msg', 'User registration is disallowed. We already have an administrator');
        res.redirect('/users/login');
        return;
      }
      return next();
    });
  }
}

// req.flash('error_msg', 'User registration is disallowed. Please contact administrator');
// res.redirect('/users/login')