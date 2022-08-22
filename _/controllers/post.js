const fs = require('fs')
const PostModel = require('../models/Post')

, Utils = require('../middlewares/Utils.class')
, _ = new Utils()



/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

exports.createPost = (req, res, next) => {
  console.log(req.body)
  const postObject = JSON.parse(req.body.draf)
  const post = new PostModel({
      ...postObject
      , userId: req.auth.userId
      , imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  post.save()

  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
}

/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

exports.getAllPost = (req, res, next) => {
  PostModel.find().then(
    (posts) => {
      res.status(200).json(posts)
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      })
    }
  )
}
exports.getOnePost = (req, res, next) => {
  console.log('getOnePost')
  PostModel.findOne({
    _id: req.params.id
  }).then(
    (post) => {
      console.log(post)
      res.status(200).json(post)
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      })
    }
  )
}

/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

exports.modifyPost = (req, res, next) => {
  const postObject = req.file ? {
      ...JSON.parse(req.body.post),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }

  delete postObject._userId
  PostModel.findOne({_id: req.params.id})
      .then((post) => {
          if (post.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'})
          } else {
              PostModel.updateOne({ _id: req.params.id}, { ...postObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }))
          }
      })
      .catch((error) => {
          res.status(400).json({ error })
      })
}

/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

exports.deletePost = (req, res, next) => {
  PostModel.findOne({ _id: req.params.id})
      .then(post => {
          if (post.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'})
          } else {
              const filename = post.imageUrl.split('/images/')[1]
              fs.unlink(`images/${filename}`, () => {
                  PostModel.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }))
              })
          }
      })
      .catch( error => {
          res.status(500).json({ error })
      })
}

/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

// necmLikes
// {{like_functionnality}}

// necmLikes
// {{share_functionnality}}

// necmLikes
// {{comment_functionnality}}

// necmLikes
// {{analytic_functionnality}}