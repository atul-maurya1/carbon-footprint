// server/src/routes/leaderboard.routes.js
const router = require('express').Router()
const auth   = require('../middleware/auth.middleware')
const Activity = require('../models/Activity.model')
const User   = require('../models/User.model')

// GET /api/v1/leaderboard/global
router.get('/global', auth, async (req, res, next) => {
  try {
    const { period = 'week', limit = 20 } = req.query
    const since = new Date()
    if (period === 'week')  since.setDate(since.getDate() - 7) 
    if (period === 'month') since.setDate(since.getDate() - 30)
    if (period === 'all')   since.setFullYear(2000)

    const top = await Activity.aggregate([
      { $match: { date: { $gte: since } } },
      { $group: { _id: '$userId', totalCO2: { $sum: '$co2Equivalent' } } },
      { $sort: { totalCO2: -1 } },
      { $limit: +limit },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { userId: '$_id', totalCO2: 1, displayName: '$user.displayName', avatar: '$user.avatar', level: '$user.stats.level', country: '$user.profile.country' } }
    ])

    const withRank = top.map((u, i) => ({ ...u, rank: i + 1, isMe: u.userId.toString() === req.user._id.toString() }))
    res.json({ success: true, data: withRank })
  } catch (err) { next(err) }
})

// GET /api/v1/leaderboard/my-rank
router.get('/my-rank', auth, async (req, res, next) => {
  try {
    const since = new Date(); since.setDate(since.getDate() - 7)
    const userTotal = await Activity.aggregate([
      { $match: { userId: req.user._id, date: { $gte: since } } },
      { $group: { _id: null, total: { $sum: '$co2Equivalent' } } }
    ])
    const myTotal = userTotal[0]?.total || 0

    const higherCount = await Activity.aggregate([
      { $match: { date: { $gte: since } } },
      { $group: { _id: '$userId', total: { $sum: '$co2Equivalent' } } },
      { $match: { total: { $gt: myTotal } } },
      { $count: 'count' }
    ])
    const rank = (higherCount[0]?.count || 0) + 1
    res.json({ success: true, data: { rank, totalCO2: myTotal.toFixed(2) } })
  } catch (err) { next(err) }
})

module.exports = router
