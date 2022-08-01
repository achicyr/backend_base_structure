const fs = require('fs');
const Sauce = require('../models/SauceRecipe');

exports.createSauce = (req, res, next) => {
  console.log(req.body);
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.getOneSauce = (req, res, next) => {
  console.log('getOneSauce');
  // console.log(Object.keys(res));
  // console.log(res.req);
  // console.log(req);
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      console.log(sauce);
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.likeSauce = (req, res, next) => {
  console.log('likeSauce')
  // console.log(req.body)
  // console.log(req.auth.userId)

  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      console.log(sauce);
      console.log(req.body)
      let {usersLiked,usersDisliked,likes,dislikes} = sauce
      , disliked = usersDisliked.includes(req.auth.userId)
      , liked = usersLiked.includes(req.auth.userId)
      , {like} = req.body
      if(like == 0) {
        sauce.likes = liked ? likes -1 : likes
        sauce.dislikes = disliked ? dislikes -1 : dislikes
        console.log("0")
        console.log(sauce.usersLiked.filter(v => v!=req.auth.userId))
        sauce.usersLiked = sauce.usersLiked.filter(v => v!=req.auth.userId)
        sauce.usersDisliked = sauce.usersDisliked.filter(v => v!=req.auth.userId)
      }
      if(like == 1){
        console.log("1")
        sauce.usersLiked.push(req.auth.userId)
        sauce.likes++
      }
      if(like == -1){
        console.log("-1")
        sauce.usersDisliked.push(req.auth.userId)
        sauce.dislikes++
      }

      // let a = {...({likes,dislikes,usersLiked,usersDisliked} = sauce._doc)}
      // console.log(a,sauce);
      console.log("req.auth.userId");
      console.log({ _id: req.auth.userId})
      console.log({ _id: req.params.id})
      console.log("req.params.id");

      Sauce.updateOne({ _id: req.params.id}, { ...({likes,dislikes,usersLiked,usersDisliked} = sauce._doc)})
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

  // new Sauce({
  //     ...sauceObject
  // })
  // .save()
  // .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  // .catch(error => { res.status(400).json( { error })})
};
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};