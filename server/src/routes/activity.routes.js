// server/src/routes/activity.routes.js
const router   = require('express').Router()
const auth     = require('../middleware/auth.middleware')
const Activity = require('../models/Activity.model')
const User     = require('../models/User.model')

const EMISSION_FACTORS = { 
  transport: {
    car_gasoline: { factor: 0.192, unit: 'km' }, car_diesel: { factor: 0.171, unit: 'km' },
    car_ev:       { factor: 0.053, unit: 'km' }, car_hybrid: { factor: 0.111, unit: 'km' },
    motorcycle:   { factor: 0.114, unit: 'km' }, bus:        { factor: 0.089, unit: 'km' },
    train:        { factor: 0.041, unit: 'km' }, subway:     { factor: 0.028, unit: 'km' },
    flight_short: { factor: 0.255, unit: 'km' }, flight_long:{ factor: 0.195, unit: 'km' },
    cycling: { factor: 0, unit: 'km' }, walking: { factor: 0, unit: 'km' },
  },
  food: {
    beef: { factor: 27.0, unit: 'kg' }, lamb: { factor: 39.2, unit: 'kg' }, pork: { factor: 12.1, unit: 'kg' },
    chicken: { factor: 6.9, unit: 'kg' }, fish: { factor: 6.1, unit: 'kg' }, dairy: { factor: 3.2, unit: 'litre' },
    cheese: { factor: 13.5, unit: 'kg' }, eggs: { factor: 3.6, unit: 'dozen' }, vegetables: { factor: 2.0, unit: 'kg' },
    fruits: { factor: 1.1, unit: 'kg' }, grains: { factor: 1.4, unit: 'kg' }, coffee: { factor: 28.5, unit: 'kg' },
    chocolate: { factor: 18.7, unit: 'kg' }, tofu: { factor: 3.0, unit: 'kg' },
  },
  energy: {
    electricity_coal:  { factor: 0.82, unit: 'kWh' }, electricity_mix:   { factor: 0.43, unit: 'kWh' },
    electricity_renew: { factor: 0.05, unit: 'kWh' }, natural_gas:       { factor: 2.04, unit: 'm³'  },
    heating_oil:       { factor: 2.96, unit: 'litre'}, lpg:              { factor: 2.98, unit: 'kg'  },
    wood:              { factor: 0.39, unit: 'kg'  },
  },
  shopping: {
    clothing: { factor: 10.0, unit: 'item' }, electronics: { factor: 70.0, unit: 'item' },
    furniture: { factor: 45.0, unit: 'item' }, books: { factor: 2.5, unit: 'item' }, online_order: { factor: 0.5, unit: 'pkg' },
  },
  waste: {
    landfill:  { factor: 0.58, unit: 'kg' }, recycled: { factor: 0.02, unit: 'kg' }, composted: { factor: 0.01, unit: 'kg' },
  }
}

function calcCO2(category, subcategory, quantity) {
  const factors = EMISSION_FACTORS[category]
  if (!factors) return 0
  const entry = factors[subcategory]
  if (!entry) return 0
  return parseFloat((entry.factor * quantity).toFixed(4))
}

// GET /api/v1/activities  (paginated)
router.get('/', auth, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, from, to } = req.query
    const query = { userId: req.user._id }
    if (category) query.category = category
    if (from || to) query.date = {}
    if (from) query.date.$gte = new Date(from)
    if (to)   query.date.$lte = new Date(to)

    const total = await Activity.countDocuments(query)
    const activities = await Activity.find(query)
      .sort({ date: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)

    res.json({
      success: true,
      data: activities,
      meta: { total, page: +page, limit: +limit, pages: Math.ceil(total / +limit) }
    })
  } catch (err) { next(err) }
})

// POST /api/v1/activities
router.post('/', auth, async (req, res, next) => {
  try {
    const { category, subcategory, quantity, unit, date, description, source } = req.body
    if (!category || !subcategory || quantity == null) {
      return res.status(400).json({ success: false, error: { message: 'category, subcategory and quantity are required' } })
    }

    const co2Equivalent = calcCO2(category, subcategory, +quantity)
    const resolvedUnit  = unit || EMISSION_FACTORS[category]?.[subcategory]?.unit || 'unit'

    const activity = await Activity.create({
      userId: req.user._id, category, subcategory, description: description || '',
      quantity: +quantity, unit: resolvedUnit, co2Equivalent,
      date: date ? new Date(date) : new Date(), source: source || 'manual',
    })

    // Update user stats
    await updateUserStats(req.user._id, co2Equivalent)

    res.status(201).json({ success: true, data: activity })
  } catch (err) { next(err) }
})

// DELETE /api/v1/activities/:id
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const activity = await Activity.findOne({ _id: req.params.id, userId: req.user._id })
    if (!activity) return res.status(404).json({ success: false, error: { message: 'Activity not found' } })
    await activity.deleteOne()
    res.json({ success: true, data: { message: 'Deleted' } })
  } catch (err) { next(err) }
})

// GET /api/v1/activities/categories
router.get('/categories', (req, res) => {
  res.json({ success: true, data: EMISSION_FACTORS })
})

async function updateUserStats(userId, co2kg) {
  const today = new Date().toDateString()
  const user  = await User.findById(userId)
  if (!user) return

  const updates = {
    $inc: { 'stats.xp': 10, 'stats.totalActivities': 1 }
  }

  const lastLog = user.stats.lastLogDate ? new Date(user.stats.lastLogDate).toDateString() : null
  if (lastLog !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const wasYesterday = lastLog === yesterday.toDateString()
    const newStreak = wasYesterday ? (user.stats.currentStreak + 1) : 1
    updates.$set = {
      'stats.lastLogDate': new Date(),
      'stats.currentStreak': newStreak,
      'stats.longestStreak': Math.max(user.stats.longestStreak, newStreak),
    }
    updates.$inc['stats.xp'] += wasYesterday ? 25 : 0 // streak bonus
  }

  await User.findByIdAndUpdate(userId, updates)
}

module.exports = router
