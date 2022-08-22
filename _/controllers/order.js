const fs = require('fs')
const OrderModel = require('../models/Order')

, Utils = require('../middlewares/Utils.class')
, _ = new Utils()



/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

exports.createOrder = (req, res, next) => {
  console.log(req.body)
  const orderObject = JSON.parse(req.body.draf)
  const order = new OrderModel({
      ...orderObject
      , userId: req.auth.userId
      , imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  order.save()

  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
}

/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

exports.getAllOrder = (req, res, next) => {
  OrderModel.find().then(
    (orders) => {
      res.status(200).json(orders)
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      })
    }
  )
}
exports.getOneOrder = (req, res, next) => {
  console.log('getOneOrder')
  OrderModel.findOne({
    _id: req.params.id
  }).then(
    (order) => {
      console.log(order)
      res.status(200).json(order)
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

exports.modifyOrder = (req, res, next) => {
  const orderObject = req.file ? {
      ...JSON.parse(req.body.order),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }

  delete orderObject._userId
  OrderModel.findOne({_id: req.params.id})
      .then((order) => {
          if (order.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'})
          } else {
              OrderModel.updateOne({ _id: req.params.id}, { ...orderObject, _id: req.params.id})
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

exports.deleteOrder = (req, res, next) => {
  OrderModel.findOne({ _id: req.params.id})
      .then(order => {
          if (order.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'})
          } else {
              const filename = order.imageUrl.split('/images/')[1]
              fs.unlink(`images/${filename}`, () => {
                  OrderModel.deleteOne({_id: req.params.id})
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