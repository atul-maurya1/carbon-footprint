// server/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken')
const User = require('../models/User.model')

module.exports = async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No token provided' } })
    }
    const token = header.slice(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-passwordHash')
    if (!user) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User not found' } })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } })
  }
}
