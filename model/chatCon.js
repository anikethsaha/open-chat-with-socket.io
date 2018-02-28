var mongoose = require('mongoose');
var chatCon = new mongoose.Schema({
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  msgBody : {
    type : String,
    required:true,
  },
  createAt : {
    type : Date,
    default: Date.now,

  },
  senderName : {
    type : String,
    required : true,
  }
});
module.exports = mongoose.model("chatCon",chatCon);
