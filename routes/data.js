const express = require('express')
const router = express.Router()
const dataCtrl = require('../controllers/data')

router.get('/', dataCtrl.getAll)
// router.get('/menus/', dataCtrl.getOneMenus)
// router.get('/menus/:id', dataCtrl.getOneMenu)

module.exports = router