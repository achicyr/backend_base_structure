const express = require('express')
const router = express.Router()
const dataCtrl = require('../controllers/data')

router.get('/', dataCtrl.getAllData)
router.get('/:id', dataCtrl.getOneData)
router.post('/', dataCtrl.createData)
router.put('/:id', dataCtrl.updateData)
router.delete('/:id', dataCtrl.deleteData)

module.exports = router