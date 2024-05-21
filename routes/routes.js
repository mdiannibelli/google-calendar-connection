const express = require('express')
const { auth, redirectAuth, getCalendarById } = require('../controllers/google-calendar')

const router = express.Router()

router.get('/auth', auth)
router.get('/oauth2callback', redirectAuth)
router.get('/calendars/:calendarId', getCalendarById)

module.exports = router
