var mongoose = require('mongoose');

var user = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,

    required: true,
    auto: true,
  },
  email : {
    type : String,
    required : true,
  },
  password : {
    type : String,
    required : true,
  },
  name : {
    type : String,
    required : true,
  },
  dp_originalName : {
    type : String,

  },
  dp_contenttype : {
    type : String,
  },
  dp_type :{
    type : String,
  },
  dp_name :{
    type : String,
  }

});
module.exports = mongoose.model("newuser",user);
