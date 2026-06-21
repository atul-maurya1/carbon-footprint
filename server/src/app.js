// server/src/app.js
const express  = require('express')
const cors     = require('cors')
const helmet   = require('helmet')
const morgan   = require('morgan')
const rateLimit = require('express-rate-limit')

const authRoutes       = require('./routes/auth.routes')
const userRoutes       = require('./routes/user.routes')
const activityRoutes   = require('./routes/activity.routes')
const footprintRoutes  = require('./routes/footprint.routes')
const aiRoutes         = require('./routes/ai.routes')
const challengeRoutes  = require('./routes/challenge.routes')
const leaderboardRoutes= require('./routes/leaderboard.routes')
const { errorHandler } = require('./middleware/error.middleware')

const app = express()

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

// CORS
const cors = require('cors')

app.use(cors({
  origin: [
    'https://carbon-footprint-frontend-62aqeflqk-atul15.vercel.app'
  ],
  credentials: true
}))


// Rate limiting
app.use('/api/v1/ai', rateLimit({ windowMs: 60_000, max: 20, message: { success: false, error: { message: 'Too many AI requests, please slow down.' } } }))
app.use('/api/', rateLimit({ windowMs: 15 * 60_000, max: 200 }))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// API Routes
app.use('/api/v1/auth',        authRoutes)
app.use('/api/v1/users',       userRoutes)
app.use('/api/v1/activities',  activityRoutes)
app.use('/api/v1/footprint',   footprintRoutes)
app.use('/api/v1/ai',          aiRoutes)
app.use('/api/v1/challenges',  challengeRoutes)
app.use('/api/v1/leaderboard', leaderboardRoutes)

// 404
app.use((req, res) => res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` } }))

// Error handler
app.use(errorHandler)

module.exports = app
