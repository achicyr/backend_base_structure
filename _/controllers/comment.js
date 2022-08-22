const fs = require('fs')
const CommentModel = require('../models/Comment')

, Utils = require('../middlewares/Utils.class')
, _ = new Utils()



/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

exports.createComment = (req, res, next) => {
  console.log(req.body)
  const commentObject = JSON.parse(req.body.draf)
  const comment = new CommentModel({
      ...commentObject
      , userId: req.auth.userId
      , imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  comment.save()

  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
}

/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

exports.getAllComment = (req, res, next) => {
  CommentModel.find().then(
    (comments) => {
      res.status(200).json(comments)
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      })
    }
  )
}
exports.getOneComment = (req, res, next) => {
  console.log('getOneComment')
  CommentModel.findOne({
    _id: req.params.id
  }).then(
    (comment) => {
      console.log(comment)
      res.status(200).json(comment)
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

exports.modifyComment = (req, res, next) => {
  const commentObject = req.file ? {
      ...JSON.parse(req.body.comment),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }

  delete commentObject._userId
  CommentModel.findOne({_id: req.params.id})
      .then((comment) => {
          if (comment.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'})
          } else {
              CommentModel.updateOne({ _id: req.params.id}, { ...commentObject, _id: req.params.id})
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

exports.deleteComment = (req, res, next) => {
  CommentModel.findOne({ _id: req.params.id})
      .then(comment => {
          if (comment.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'})
          } else {
              const filename = comment.imageUrl.split('/images/')[1]
              fs.unlink(`images/${filename}`, () => {
                  CommentModel.deleteOne({_id: req.params.id})
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