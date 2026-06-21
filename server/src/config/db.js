// server/src/config/db.js
const mongoose = require('mongoose')

module.exports = async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbontrace'
  try {
    await mongoose.connect(uri)
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`)
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  }

  mongoose.connection.on('error', err => console.error('MongoDB error:', err))
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'))
}
