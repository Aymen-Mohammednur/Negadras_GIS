const router = require('express').Router()
const { createPin, getPins, searchPins, searchPinsByCategory } = require('../controllers/pinController')

router.post('/', createPin)
router.get('/', getPins)
router.get('/search', searchPins)
router.get('/category', searchPinsByCategory)

module.exports = router