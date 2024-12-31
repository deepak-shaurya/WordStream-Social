const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Project-2') // Remove deprecated options
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));


const userSchema = mongoose.Schema({
    username: String,
    name : String,
    password: String,
    email : String,
    age: Number,
    posts:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
      }
    ],
    profilepic:{
      type: String,
      default: "uplode.png"
    }
  })

const userModel = mongoose.model("userAcc", userSchema);
module.exports = userModel;