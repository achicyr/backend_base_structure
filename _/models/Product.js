const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productId: { type: String, required: true },
    titre: { type: String, required: true },
    imageUrl: { type: String, required: true },
    contenu: { type: String, required: true },
    stock: { type: Number, required: true },
    creationDate: { type: String, required: true },
    // nemmLike
    // nemmShare
    // nemmComment
})

module.exports = mongoose.model('Product', productSchema)
