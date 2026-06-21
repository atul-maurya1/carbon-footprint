// server/src/routes/challenge.routes.js
const router = require('express').Router()
const auth   = require('../middleware/auth.middleware')

// Seeded challenges (in-memory for MVP; replace with DB later)
const CHALLENGES = [
  { id:'1', title:'No-Car Week',      desc:'Use only public transport for 7 days', category:'transport', difficulty:'medium', duration:7,  xpReward:150, participants:1247 },
  { id:'2', title:'Plant-Based Week', desc:'Eat vegan for 7 days',                 category:'food',      difficulty:'easy',   duration:7,  xpReward:100, participants:3821 },
  { id:'3', title:'Zero Waste Day',   desc:'Produce no landfill waste for a day',  category:'waste',     difficulty:'hard',   duration:1,  xpReward:75,  participants:892  },
  { id:'4', title:'Lights Out 30min', desc:'No electricity for 30 minutes',        category:'energy',    difficulty:'easy',   duration:1,  xpReward:50,  participants:5630 },
  { id:'5', title:'Local Produce Month',desc:'Buy only locally sourced food for 30 days',category:'food', difficulty:'hard',  duration:30, xpReward:300, participants:456  },
  { id:'6', title:'Cycle to Work',    desc:'Bike to work every day this week',     category:'transport', difficulty:'medium', duration:5,  xpReward:125, participants:2109 },
]

// GET /api/v1/challenges
router.get('/', auth, (req, res) => {
  res.json({ success: true, data: CHALLENGES })
})

// GET /api/v1/challenges/:id
router.get('/:id', auth, (req, res) => {
  const challenge = CHALLENGES.find(c => c.id === req.params.id)
  if (!challenge) return res.status(404).json({ success: false, error: { message: 'Challenge not found' } })
  res.json({ success: true, data: challenge })
})

// POST /api/v1/challenges/:id/join
router.post('/:id/join', auth, (req, res) => {
  const challenge = CHALLENGES.find(c => c.id === req.params.id)
  if (!challenge) return res.status(404).json({ success: false, error: { message: 'Challenge not found' } })
  res.json({ success: true, data: { message: 'Joined challenge!', challengeId: req.params.id } })
})

module.exports = router
