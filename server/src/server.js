// server/src/server.js
require('dotenv').config()
const http = require('http')
const app  = require('./app')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 3001

async function start() {
  await connectDB()
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`\n🌿 CarbonTrace API running on http://localhost:${PORT}`)
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`   Health: http://localhost:${PORT}/health\n`)
  })

  process.on('SIGTERM', () => { server.close(() => process.exit(0)) }) 
}

start().catch(err => { console.error('Failed to start server:', err); process.exit(1) })
