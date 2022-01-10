const router = require('express').Router()
const { register, login } = require('../controllers/authController')
const { getUsers } = require('../controllers/userController')

router.post('/register', register)
router.post('/login', login)
router.get('/', getUsers)


module.exports = router