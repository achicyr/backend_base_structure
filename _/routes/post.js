const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer')
const postCtrl = require('../controllers/post')

router.get('/', auth, postCtrl.getAllPost)
router.post('/', auth, multer, postCtrl.createPost)
router.get('/:id', auth, postCtrl.getOnePost)
router.put('/:id', auth, multer, postCtrl.modifyPost)
router.delete('/:id', auth, postCtrl.deletePost)
// router.get('/:id/like', auth, postCtrl.likePost)
// router.get('/:id/share', auth, postCtrl.sharePost)
// router.post('/:id/comment', auth, postCtrl.commentPost)
// router.get('/:id/analytic', auth, postCtrl.analyticPost)

module.exports = router