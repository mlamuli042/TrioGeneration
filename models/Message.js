const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  details: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now 
  }
  
});

mongoose.model('messages', messageSchema);