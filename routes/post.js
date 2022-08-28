const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer')
const postCtrl = require('../controllers/post')

router.get('/', auth, postCtrl.getAllpost)
router.post('/', auth, multer, postCtrl.createpost)
router.get('/:id', auth, postCtrl.getOnepost)
router.put('/:id', auth, multer, postCtrl.modifypost)
router.delete('/:id', auth, postCtrl.deletepost)
router.post('/:id/like', auth, postCtrl.likepost)

module.exports = router