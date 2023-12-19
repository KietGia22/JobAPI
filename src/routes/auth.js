const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')

const { login, register, update } = require('../controllers/auth')

router.post('/login', login)
router.post('/register', register)
router.patch('/updateUser', authenticateUser, update)

module.exports = router
