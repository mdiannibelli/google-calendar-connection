const express = require('express')
const cors = require('cors')
const routes = require('./routes/routes')
const cookieSession = require('cookie-session')
/* const process = require('process') */

const oauth = require('./auth/ouath')

const app = express()
const $PORT = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 // 24 horas
}))

// Rutas
app.use('/', routes)

// Middleware para verificar la autenticación
app.use((req, res, next) => {
  if (!req.session.tokens) {
    return res.status(401).send('Authentication required. Please visit /auth to authenticate.')
  }
  oauth.setCredentials(req.session.tokens)
  next()
})

app.listen($PORT, () => {
  console.log(`Server running in port ${$PORT}`)
})
