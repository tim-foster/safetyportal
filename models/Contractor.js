var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var companySchema = new mongoose.Schema({
  companyName: { type: String, unique : true},
  naicsVal : String,
  address: {
  	street : String,
  	city : String,
  	state : String,
  	zip : String
  },

  waLic : {
  	licNum : String,
  	licLim : String
  },
   tokens: Array,
  safetyOff : {
  	name : {type: String, default: ''},
  	telNum : {type: String, default: ''},
  	email : {type: String, default: ''}
  },


  resetPasswordToken: String,
  resetPasswordExpires: Date
});

module.exports = mongoose.model('Contractor', companySchema);