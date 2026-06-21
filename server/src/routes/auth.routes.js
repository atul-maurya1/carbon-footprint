// server/src/routes/auth.routes.js
const router  = require('express').Router()
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const User    = require('../models/User.model')
const auth    = require('../middleware/auth.middleware')

const sign = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/v1/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body
    if (!email || !password || !displayName) {
      return res.status(400).json({ success: false, error: { message: 'All fields required' } })
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, error: { message: 'Password must be at least 8 characters' } })
    }
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ success: false, error: { message: 'Email already registered' } })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ email, displayName, passwordHash, provider: 'email' })
    const token = sign(user._id)
    res.status(201).json({ success: true, data: { token, user: user.toSafeObject() } })
  } catch (err) { next(err) }
})

// POST /api/v1/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ success: false, error: { message: 'Email and password required' } })
    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.passwordHash || ''))) {
      return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } })
    }
    const token = sign(user._id)
    res.json({ success: true, data: { token, user: user.toSafeObject() } })
  } catch (err) { next(err) }
})

// GET /api/v1/auth/me
router.get('/me', auth, async (req, res) => {
  res.json({ success: true, data: req.user.toSafeObject() })
})

// POST /api/v1/auth/logout  (client just drops token, but we acknowledge)
router.post('/logout', auth, (req, res) => {
  res.json({ success: true, data: { message: 'Logged out' } })
})

module.exports = router
