// server/src/routes/footprint.routes.js
const router   = require('express').Router()
const auth     = require('../middleware/auth.middleware')
const Activity = require('../models/Activity.model')

const GLOBAL_AVG_KG_DAY = 4000 / 365 // ~10.96

// GET /api/v1/footprint/summary
router.get('/summary', auth, async (req, res, next) => {
  try {
    const userId = req.user._id
    const now = new Date()
    const startOfDay   = new Date(now); startOfDay.setHours(0,0,0,0)
    const startOfWeek  = new Date(now); startOfWeek.setDate(now.getDate() - 7)
    const startOfMonth = new Date(now); startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0)

    const [today, week, month] = await Promise.all([
      Activity.aggregate([{ $match: { userId, date: { $gte: startOfDay } } }, { $group: { _id: null, total: { $sum: '$co2Equivalent' } } }]),
      Activity.aggregate([{ $match: { userId, date: { $gte: startOfWeek } } }, { $group: { _id: null, total: { $sum: '$co2Equivalent' } } }]),
      Activity.aggregate([{ $match: { userId, date: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$co2Equivalent' } } }]),
    ])

    const todayKg  = today[0]?.total  || 0
    const weekKg   = week[0]?.total   || 0
    const monthKg  = month[0]?.total  || 0
    const globalAvgWeek = GLOBAL_AVG_KG_DAY * 7

    res.json({
      success: true, data: {
        today: +todayKg.toFixed(2), week: +weekKg.toFixed(2), month: +monthKg.toFixed(2),
        vsGlobalAvgWeek: +(((weekKg - globalAvgWeek) / globalAvgWeek) * 100).toFixed(1),
        globalAvgDay: +GLOBAL_AVG_KG_DAY.toFixed(2),
      }
    })
  } catch (err) { next(err) }
})

// GET /api/v1/footprint/breakdown
router.get('/breakdown', auth, async (req, res, next) => {
  try {
    const { period = '30' } = req.query
    const since = new Date(); since.setDate(since.getDate() - +period)
    const breakdown = await Activity.aggregate([
      { $match: { userId: req.user._id, date: { $gte: since } } },
      { $group: { _id: '$category', total: { $sum: '$co2Equivalent' } } },
      { $sort: { total: -1 } }
    ])
    const total = breakdown.reduce((s, b) => s + b.total, 0)
    res.json({
      success: true, data: breakdown.map(b => ({
        category: b._id, kg: +b.total.toFixed(2), pct: total ? +((b.total / total) * 100).toFixed(1) : 0
      }))
    })
  } catch (err) { next(err) }
})

// GET /api/v1/footprint/history
router.get('/history', auth, async (req, res, next) => {
  try {
    const { days = 30 } = req.query
    const since = new Date(); since.setDate(since.getDate() - +days)
    const history = await Activity.aggregate([
      { $match: { userId: req.user._id, date: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, total: { $sum: '$co2Equivalent' } } },
      { $sort: { _id: 1 } }
    ])
    res.json({ success: true, data: history.map(h => ({ date: h._id, kg: +h.total.toFixed(2) })) })
  } catch (err) { next(err) }
})

module.exports = router
