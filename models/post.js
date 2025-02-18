const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "userAcc"
    },
    date : {
        type: Date,
        default : Date.now
    },
    content: String,
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userAcc"
    }
})

const postModel = mongoose.model("post", postSchema);
module.exports = postModel;