// server/src/models/Activity.model.js
const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category:    { type: String, enum: ['transport','food','energy','shopping','waste','travel'], required: true },
  subcategory: { type: String, required: true },
  description: { type: String, default: '' },
  quantity:    { type: Number, required: true, min: 0 },
  unit:        { type: String, required: true },
  co2Equivalent: { type: Number, required: true, min: 0 }, // in kg
  date:        { type: Date, default: Date.now, index: true },
  source:      { type: String, enum: ['manual','nlp','ocr'], default: 'manual' },
  metadata:    { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true })

activitySchema.index({ userId: 1, date: -1 })
activitySchema.index({ userId: 1, category: 1 })

module.exports = mongoose.model('Activity', activitySchema) 
