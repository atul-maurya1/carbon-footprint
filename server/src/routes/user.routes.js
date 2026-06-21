// server/src/routes/user.routes.js
const router = require('express').Router()
const auth   = require('../middleware/auth.middleware')
const User   = require('../models/User.model')

// GET /api/v1/users/stats
router.get('/stats', auth, async (req, res, next) => {
  try {
    res.json({ success: true, data: req.user.stats })
  } catch (err) { next(err) }
})

// PUT /api/v1/users/profile
router.put('/profile', auth, async (req, res, next) => {
  try {
    const { displayName, preferences } = req.body
    const updates = {}
    if (displayName) updates.displayName = displayName
    if (preferences) updates.preferences = { ...req.user.preferences, ...preferences }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-passwordHash')
    res.json({ success: true, data: user.toSafeObject() })
  } catch (err) { next(err) }
})

// PUT /api/v1/users/onboarding
router.put('/onboarding', auth, async (req, res, next) => {
  try {
    const { country, householdSize, vehicleType, commuteKm, commuteFrequency,
            dietType, homeType, energySource, monthlyKwh, goal } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        onboardingComplete: true,
        'profile.country':      country,
        'profile.householdSize': householdSize,
        'profile.vehicleType':  vehicleType,
        'profile.commuteKm':    commuteKm,
        'profile.commuteFrequency': commuteFrequency,
        'profile.dietType':     dietType,
        'profile.homeType':     homeType,
        'profile.energySource': energySource,
        'profile.monthlyKwh':   monthlyKwh,
        'profile.goal':         goal,
        'stats.xp':             req.user.stats.xp + 100, // onboarding XP reward
      },
      { new: true }
    ).select('-passwordHash')  
    res.json({ success: true, data: user.toSafeObject() })
  } catch (err) { next(err) }
})

module.exports = router
