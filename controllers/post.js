const fs = require('fs')
const postModel = require('../models/post')

, Utils = require('../middlewares/Utils.class')
, _ = new Utils()



/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

// necmCRUDcreate
exports.createpost = (req, res, next) => {
  console.log(req.body)
  const postObject = JSON.parse(req.body.draf)
  const post = new postModel({
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

// necmCRUDfindAll
exports.getAllpost = (req, res, next) => {
  postModel.find().then(
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
// necmCRUDfindOne
exports.getOnepost = (req, res, next) => {
  console.log('getOnepost')
  postModel.findOne({
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

// necmCRUDfindOneUpdate
exports.modifypost = (req, res, next) => {
  const postObject = req.file ? {
      ...JSON.parse(req.body.post),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }

  delete postObject._userId
  postModel.findOne({_id: req.params.id})
      .then((post) => {
          if (post.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'})
          } else {
              postModel.updateOne({ _id: req.params.id}, { ...postObject, _id: req.params.id})
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

// necmCRUDfindOneDelete
// necmCRUDfindOneDelete_FS
exports.deletepost = (req, res, next) => {
  postModel.findOne({ _id: req.params.id})
      .then(post => {
          if (post.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'})
          } else {
              const filename = post.imageUrl.split('/images/')[1]
              fs.unlink(`images/${filename}`, () => {
                  postModel.deleteOne({_id: req.params.id})
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
exports.likepost = (req, res, next) => {
  console.log('likepost')
  // console.log(req.body)
  // console.log(req.auth.userId)

  postModel.findOne({
    _id: req.params.id
  }).then(
    (post) => {
      console.log(post)
      console.log(req.body)
      let {usersLiked,usersDisliked,likes,dislikes} = post
      , disliked = usersDisliked.includes(req.auth.userId)
      , liked = usersLiked.includes(req.auth.userId)
      , {like} = req.body
      if(like == 0) {
        post.likes = liked ? likes -1 : likes
        post.dislikes = disliked ? dislikes -1 : dislikes
        console.log("0")
        console.log(post.usersLiked.filter(v => v!=req.auth.userId))
        post.usersLiked = post.usersLiked.filter(v => v!=req.auth.userId)
        post.usersDisliked = post.usersDisliked.filter(v => v!=req.auth.userId)
      }
      if(like == 1){
        console.log("1")
        post.usersLiked.push(req.auth.userId)
        post.likes++
      }
      if(like == -1){
        console.log("-1")
        post.usersDisliked.push(req.auth.userId)
        post.dislikes++
      }

      // let a = {...({likes,dislikes,usersLiked,usersDisliked} = post._doc)}
      // console.log(a,post)
      console.log("req.auth.userId")
      console.log({ _id: req.auth.userId})
      console.log({ _id: req.params.id})
      console.log("req.params.id")

      postModel.updateOne({ _id: req.params.id}, { ...({likes,dislikes,usersLiked,usersDisliked} = post._doc)})
      .then(() => res.status(201).json({message : 'Vote pris en compte!'}))
      .catch(error => res.status(401).json({ error }))

    }
  ).catch(
    (error) => {
      res.status(403).json({
        error: error
      })
    }
  )
}

/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
