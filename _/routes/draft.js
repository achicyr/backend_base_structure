const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer')
const draftCtrl = require('../controllers/draft')

router.get('/', auth, draftCtrl.getAllDraft)
router.post('/', auth, multer, draftCtrl.createDraft)
router.get('/:id', auth, draftCtrl.getOneDraft)
router.put('/:id', auth, multer, draftCtrl.modifyDraft)
router.delete('/:id', auth, draftCtrl.deleteDraft)
router.post('/:id/like', auth, draftCtrl.likeDraft)

module.exports = router