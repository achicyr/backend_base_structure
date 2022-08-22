const fs = require('fs')
const DraftModel = require('../models/Draft')

, Utils = require('../middlewares/Utils.class')
, _ = new Utils()



/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

// necmCRUDcreate
exports.createDraft = (req, res, next) => {
  console.log(req.body)
  const draftObject = JSON.parse(req.body.draf)
  const draft = new DraftModel({
      ...draftObject
      , userId: req.auth.userId
      , imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  draft.save()

  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
}

/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

// necmCRUDfindAll
exports.getAllDraft = (req, res, next) => {
  DraftModel.find().then(
    (drafts) => {
      res.status(200).json(drafts)
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
exports.getOneDraft = (req, res, next) => {
  console.log('getOneDraft')
  DraftModel.findOne({
    _id: req.params.id
  }).then(
    (draft) => {
      console.log(draft)
      res.status(200).json(draft)
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
exports.modifyDraft = (req, res, next) => {
  const draftObject = req.file ? {
      ...JSON.parse(req.body.draft),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }

  delete draftObject._userId
  DraftModel.findOne({_id: req.params.id})
      .then((draft) => {
          if (draft.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'})
          } else {
              DraftModel.updateOne({ _id: req.params.id}, { ...draftObject, _id: req.params.id})
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
exports.deleteDraft = (req, res, next) => {
  DraftModel.findOne({ _id: req.params.id})
      .then(draft => {
          if (draft.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'})
          } else {
              const filename = draft.imageUrl.split('/images/')[1]
              fs.unlink(`images/${filename}`, () => {
                  DraftModel.deleteOne({_id: req.params.id})
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
exports.likeDraft = (req, res, next) => {
  console.log('likeDraft')
  // console.log(req.body)
  // console.log(req.auth.userId)

  DraftModel.findOne({
    _id: req.params.id
  }).then(
    (draft) => {
      console.log(draft)
      console.log(req.body)
      let {usersLiked,usersDisliked,likes,dislikes} = draft
      , disliked = usersDisliked.includes(req.auth.userId)
      , liked = usersLiked.includes(req.auth.userId)
      , {like} = req.body
      if(like == 0) {
        draft.likes = liked ? likes -1 : likes
        draft.dislikes = disliked ? dislikes -1 : dislikes
        console.log("0")
        console.log(draft.usersLiked.filter(v => v!=req.auth.userId))
        draft.usersLiked = draft.usersLiked.filter(v => v!=req.auth.userId)
        draft.usersDisliked = draft.usersDisliked.filter(v => v!=req.auth.userId)
      }
      if(like == 1){
        console.log("1")
        draft.usersLiked.push(req.auth.userId)
        draft.likes++
      }
      if(like == -1){
        console.log("-1")
        draft.usersDisliked.push(req.auth.userId)
        draft.dislikes++
      }

      // let a = {...({likes,dislikes,usersLiked,usersDisliked} = draft._doc)}
      // console.log(a,draft)
      console.log("req.auth.userId")
      console.log({ _id: req.auth.userId})
      console.log({ _id: req.params.id})
      console.log("req.params.id")

      DraftModel.updateOne({ _id: req.params.id}, { ...({likes,dislikes,usersLiked,usersDisliked} = draft._doc)})
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
