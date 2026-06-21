// server/src/models/User.model.js
const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  displayName:  { type: String, required: true, trim: true },
  avatar:       { type: String, default: null },
  provider:     { type: String, enum: ['email','google'], default: 'email' },
  passwordHash: { type: String, default: null },
  onboardingComplete: { type: Boolean, default: false },

  profile: {
    country:      { type: String, default: 'US' },
    region:       { type: String, default: '' },
    householdSize:{ type: Number, default: 1 },
    dietType:     { type: String, enum: ['vegan','vegetarian','omnivore','carnivore'], default: 'omnivore' },
    vehicleType:  { type: String, enum: ['none','ev','hybrid','gasoline','diesel'], default: 'gasoline' },
    commuteKm:    { type: Number, default: 20 },
    commuteFrequency: { type: Number, default: 5 },
    homeType:     { type: String, enum: ['apartment','house','condo'], default: 'apartment' },
    energySource: { type: String, enum: ['renewable','mixed','fossil'], default: 'mixed' },
    monthlyKwh:   { type: Number, default: 300 },
    goal:         { type: String, default: 'reduce_20' },
  },

  stats: {
    totalCO2Saved:   { type: Number, default: 0 },
    currentStreak:   { type: Number, default: 0 },
    longestStreak:   { type: Number, default: 0 },
    lastLogDate:     { type: Date,   default: null },
    level:           { type: Number, default: 1 },
    xp:              { type: Number, default: 0 },
    badges:          [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
    totalActivities: { type: Number, default: 0 },
  },

  preferences: {
    notifications:      { type: Boolean, default: true },
    weeklyReport:       { type: Boolean, default: true },
    challengeReminders: { type: Boolean, default: true },
    theme:              { type: String, enum: ['dark','light','system'], default: 'dark' },
  },
}, { timestamps: true })

userSchema.methods.comparePassword = async function(plain) {
  if (!this.passwordHash) return false
  return bcrypt.compare(plain, this.passwordHash)
}

userSchema.methods.toSafeObject = function() {
  const obj = this.toObject()
  delete obj.passwordHash
  delete obj.__v
  return obj
}

userSchema.pre('save', async function() {
  if (this.isModified('passwordHash') && this.passwordHash && !this.passwordHash.startsWith('$2')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
  }
})

module.exports = mongoose.model('User', userSchema)
