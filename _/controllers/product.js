const fs = require('fs')
const ProductModel = require('../models/Product')

, Utils = require('../middlewares/Utils.class')
, _ = new Utils()



/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

exports.createProduct = (req, res, next) => {
  console.log(req.body)
  const productObject = JSON.parse(req.body.draf)
  const product = new ProductModel({
      ...productObject
      , userId: req.auth.userId
      , imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  product.save()

  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
}

/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

exports.getAllProduct = (req, res, next) => {
  ProductModel.find().then(
    (products) => {
      res.status(200).json(products)
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      })
    }
  )
}
exports.getOneProduct = (req, res, next) => {
  console.log('getOneProduct')
  ProductModel.findOne({
    _id: req.params.id
  }).then(
    (product) => {
      console.log(product)
      res.status(200).json(product)
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

exports.modifyProduct = (req, res, next) => {
  const productObject = req.file ? {
      ...JSON.parse(req.body.product),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }

  delete productObject._userId
  ProductModel.findOne({_id: req.params.id})
      .then((product) => {
          if (product.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'})
          } else {
              ProductModel.updateOne({ _id: req.params.id}, { ...productObject, _id: req.params.id})
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

exports.deleteProduct = (req, res, next) => {
  ProductModel.findOne({ _id: req.params.id})
      .then(product => {
          if (product.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'})
          } else {
              const filename = product.imageUrl.split('/images/')[1]
              fs.unlink(`images/${filename}`, () => {
                  ProductModel.deleteOne({_id: req.params.id})
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