const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    userId: { type: String, required: true },
    titre: { type: String, required: true },
    imageUrl: { type: String, required: true },
    contenu: { type: String, required: true },
    creationDate: { type: String, required: true },
    // nemmLike
    // nemmShare
    // nemmComment
    // nemmBuy
})

module.exports = mongoose.model('Post', postSchema)
