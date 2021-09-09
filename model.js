const mongoose = require('mongoose')

var commentSchema = new mongoose.Schema({
    name: String,
    email: String,
    movie_id: {type: Object},
    text: String,
    date: {type: Date, default: Date.now()}
})

var comments = module.exports = mongoose.model("comments", commentSchema)
module.exports.get = (callback, limit) => {
    comments.find(callback).limit(limit)
}

