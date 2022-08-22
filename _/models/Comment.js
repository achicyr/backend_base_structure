
const commentSchema = mongoose.Schema({
    commentId: { type: String, required: true },
    titre: { type: String, required: true },
    contenu: { type: String, required: true },
    creationDate: { type: String, required: true },
    // nemmLike
})

module.exports = mongoose.model('Comment', commentSchema)
