const { google } = require('googleapis')

const oauth = require('../auth/ouath')

// Iniciar la autenticación
const auth = (req, res) => {
  const authUrl = oauth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly']
  })
  res.redirect(authUrl)
}

// Redirección OAuth2 callback
const redirectAuth = async (req, res) => {
  const code = req.query.code
  try {
    const { tokens } = await oauth.getToken(code)
    oauth.setCredentials(tokens)

    // Guardar los tokens en la sesión
    req.session.tokens = tokens

    res.send('Authentication successful! You can now close this tab and access your calendar data.')
  } catch (error) {
    console.error('Error retrieving access token', error)
    res.status(500).send('Error retrieving access token')
  }
}

const getCalendarById = async (req, res) => {
  const { calendarId } = req.params

  if (!oauth.credentials) {
    return res.status(401).send('Authentication required. Please visit /auth to authenticate.')
  }
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth })
    const events = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    })
    res.send(events.data)
  } catch (error) {
    console.log(error)
  }
}

module.exports = { auth, redirectAuth, getCalendarById }
