const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    orderId: { type: String, required: true },
    numero: { type: String, required: true },
    creationDate: { type: String, required: true },
    // nemmLike
    // nemmShare
    // nemmComment
})

module.exports = mongoose.model('Order', orderSchema)
