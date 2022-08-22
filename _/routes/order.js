const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer')
const orderCtrl = require('../controllers/order')

router.get('/', auth, orderCtrl.getAllOrder)
router.post('/', auth, multer, orderCtrl.createOrder)
router.get('/:id', auth, orderCtrl.getOneOrder)
router.put('/:id', auth, multer, orderCtrl.modifyOrder)
router.delete('/:id', auth, orderCtrl.deleteOrder)
// router.order('/:id/share', auth, orderCtrl.shareOrder)

module.exports = router