const express = require('express')
// const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const { getUser, onSignUp, onLogin } = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

// router.get('/', getUsers)
router.get('/:id', getUser)
// router.put('/:id',  updateUser)

// router.put('/:id',  requireAuth, updateUser)
// router.delete('/:id', deleteUser)
// ************************* User Routes 
// app.post('/api/login', (req, res)=>{
//   
// })
router.post('/signup', onSignUp)
router.post('/login', onLogin)

// app.post('/api/logout', (req, res)=>{
//     req.session.destroy()
//     res.send()
// })

module.exports = router