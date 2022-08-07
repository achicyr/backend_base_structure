const fs = require('fs')
const Draft = require('../models/DraftRecipe')

, Utils = require('../middlewares/Utils.class')
, _ = new Utils()



/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

exports.createDraft = (req, res, next) => {
  console.log(req.body)
  const drafObject = JSON.parse(req.body.draf)
  const draf = new Draft({
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

exports.getAllDraft = (req, res, next) => {
  Draft.find().then(
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
exports.getOneDraft = (req, res, next) => {
  console.log('getOneDraft')
  Draft.findOne({
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

exports.modifyDraft = (req, res, next) => {
  const draftObject = req.file ? {
      ...JSON.parse(req.body.draft),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }

  delete draftObject._userId
  Draft.findOne({_id: req.params.id})
      .then((draft) => {
          if (draft.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'})
          } else {
              Draft.updateOne({ _id: req.params.id}, { ...draftObject, _id: req.params.id})
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

exports.deleteDraft = (req, res, next) => {
  Draft.findOne({ _id: req.params.id})
      .then(draft => {
          if (draft.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'})
          } else {
              const filename = draft.imageUrl.split('/images/')[1]
              fs.unlink(`images/${filename}`, () => {
                  Draft.deleteOne({_id: req.params.id})
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

exports.likeDraft = (req, res, next) => {
  console.log('likeDraft')
  // console.log(req.body)
  // console.log(req.auth.userId)

  Draft.findOne({
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

      Draft.updateOne({ _id: req.params.id}, { ...({likes,dislikes,usersLiked,usersDisliked} = draft._doc)})
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
exports.getAll = (req, res, next) => {
  /*SNIPPET REQUEST BODY*/
  // ner_body
  /*SNIPPET MONGOOSE CRUD*/
  // necmfind
  /*SNIPPET express res*/
  res.status(200).json(Data)
  
}

exports.updateMenu = (req, res, next) => {
  res.json({message: "le controlleur pour cette action ('update') n'a pas encore été codé"})
}
exports.deleteMenu = (req, res, next) => {
  res.status(201).json({message: "le controlleur pour cette action ('delete') n'a pas encore été codé"})
}
exports.addMenu = (req, res, next) => {
  console.log(req.body);

  //RÉCUPÉRER DES DONNÉES AVANT DE LES SUPPRIMER, SI NÉCESSAIRE 
  let nom_restau = Object.keys(req.body)[0]
  , lieu_restau = Object.keys(req.body)[1]
  delete req.body[lieu_restau]
  //TRAITER LES DONNÉES POUR POUVOIR LES INSÉRER AU BON ENDROIT DANS LE FICHIER MODEL Draft.js
  Draft.menus.carte = {...Draft.menus.carte, ...req.body}
  //LES ÉCRIRE DANS UN FICHIER
  let buffer = new Buffer.from("const Draft = "+JSON.stringify(Draft));
  fs.open("models/Draft.js", "w", function(err, fd) {
      if(err) {
          console.log('Cant open file');
      }else {
          fs.write(fd, buffer, 0, buffer.length, 
                  null, function(err,writtenbytes) {
              if(err) {
                  console.log('Cant write to file');
              }else {
                  console.log(writtenbytes +
                      ' characters added to file');
              }
          })
      }
  })
  //RENVOYER LA RÉPONSE
  res.status(200).json({message:"Données créées avec succès"})
}
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
