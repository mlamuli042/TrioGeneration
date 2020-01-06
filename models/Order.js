const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email:{
    type:String,
    required: true
  },
  phone:{
    type:Number,
    required:true
  },
  address:{
    type: String,
    default: 'n/a'
  },
  color:{
    type: String,
    required: true
  },
  size:{
    type:String,
    required:true
  },
  date:{
    type: Date,
    default: Date.now
  }
});

mongoose.model('order', orderSchema);