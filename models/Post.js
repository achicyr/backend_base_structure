const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    userId: { type: String, required: true },
    titre: { type: String, required: true },
    imageUrl: { type: String, required: true },
    contenu: { type: String, required: true },
    creationDate: { type: String, required: true },
    likes: { default:0, type: Number, required: true },
    dislikes: { default:0, type: Number, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true },
    // nemmShare
    // nemmComment
    // nemmBuy
})

module.exports = mongoose.model('Post', postSchema)
