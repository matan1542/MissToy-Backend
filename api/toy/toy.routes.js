const express = require('express')
const { onSave, onGetById, onRemove, onLoadToys } = require('./toy.controller')
const router = express.Router()
// CREATE


// router.put('/:id',  requireAuth, updateUser)
router.get('/', onLoadToys)
router.post('/', onSave)
// UPDATE
router.put('/:toyId', onSave)
// READ
router.get('/:toyId', onGetById)
// DELETE
router.delete('/:toyId', onRemove)
module.exports = router