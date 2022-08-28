const Post = require('../models/Post')

module.exports = {
    post: {type: String, default: JSON.stringify(Post.schema.paths)}
}