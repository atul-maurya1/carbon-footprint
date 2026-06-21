// server/src/routes/ai.routes.js
const router = require('express').Router()
const auth   = require('../middleware/auth.middleware')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const Activity = require('../models/Activity.model')

function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')
  return new GoogleGenerativeAI(apiKey)
}

const SYSTEM_CONTEXT = `You are an expert environmental scientist and personal sustainability coach called "Eco". 
You help users understand and reduce their carbon footprint in a friendly, encouraging, and science-based way.
Always be specific, practical, and positive. Cite rough figures when helpful (e.g. "switching to EV saves ~130 kg CO₂ per 1000km").
Never be preachy or guilt-inducing. Format responses with clear bullet points when giving lists.
Keep responses concise (under 250 words unless asked for a detailed plan).`

// POST /api/v1/ai/chat
router.post('/chat', auth, async (req, res, next) => {
  try {
    const { message, history = [] } = req.body
    if (!message?.trim()) return res.status(400).json({ success: false, error: { message: 'Message required' } })

    // Get user footprint context
    const since = new Date(); since.setDate(since.getDate() - 30)
    const recentActivities = await Activity.find({ userId: req.user._id, date: { $gte: since } })
      .sort({ date: -1 }).limit(10).lean()

    const footprintContext = recentActivities.length > 0
      ? `User's recent activities (last 30 days): ${recentActivities.map(a => `${a.category}/${a.subcategory}: ${a.quantity} ${a.unit} = ${a.co2Equivalent}kg CO₂`).join('; ')}`
      : `User is new and hasn't logged activities yet.`

    const userContext = `User profile: diet=${req.user.profile?.dietType}, vehicle=${req.user.profile?.vehicleType}, energy=${req.user.profile?.energySource}, country=${req.user.profile?.country}.`

    const genAI = getGemini()
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: `${SYSTEM_CONTEXT}\n\n${userContext}\n${footprintContext}` }] },
        { role: 'model', parts: [{ text: "Hi! I'm Eco, your personal sustainability coach. I can see your profile and recent activity data. How can I help you reduce your carbon footprint today? 🌿" }] },
        ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }))
      ]
    })

    const result = await chat.sendMessage(message)
    const reply  = result.response.text()

    res.json({ success: true, data: { reply } })
  } catch (err) {
    console.error('Gemini AI Chat Error:', err.message || err)
    return res.json({
      success: true,
      data: {
        reply: "🌿 Hi! I'm Eco, your AI sustainability coach. To enable full AI responses, please verify that a valid GEMINI_API_KEY is configured in the server .env file. In the meantime, here's a quick tip: **Reducing meat consumption by 1 meal/day saves ~500kg CO₂ per year** — one of the highest-impact personal changes you can make!"
      }
    })
  }
})

// GET /api/v1/ai/insights
router.get('/insights', auth, async (req, res, next) => {
  try {
    const since = new Date(); since.setDate(since.getDate() - 30)
    const activities = await Activity.find({ userId: req.user._id, date: { $gte: since } }).lean()
    
    if (activities.length === 0) {
      return res.json({ success: true, data: { insights: [
        'Start logging activities to get personalized AI insights!',
        'Track your transport, food, and energy use for the most accurate footprint.',
      ]}})
    }

    const total = activities.reduce((s, a) => s + a.co2Equivalent, 0)
    const byCategory = activities.reduce((acc, a) => { acc[a.category] = (acc[a.category]||0) + a.co2Equivalent; return acc }, {})
    const topCategory = Object.entries(byCategory).sort((a,b) => b[1]-a[1])[0]

    try {
      const genAI = getGemini()
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      const prompt = `${SYSTEM_CONTEXT}\n\nUser logged ${activities.length} activities in 30 days. Total: ${total.toFixed(1)}kg CO₂. By category: ${JSON.stringify(byCategory)}. User profile: diet=${req.user.profile?.dietType}, vehicle=${req.user.profile?.vehicleType}.\n\nGive exactly 5 short, specific, actionable insights as a JSON array of strings. Each max 100 chars. Focus on biggest reduction opportunities.`
      const result = await model.generateContent(prompt)
      const text   = result.response.text()
      const match  = text.match(/\[[\s\S]*\]/)
      const insights = match ? JSON.parse(match[0]) : [text]
      res.json({ success: true, data: { insights } })
    } catch {
      res.json({ success: true, data: { insights: [
        `Your biggest source is ${topCategory?.[0] || 'unknown'} at ${topCategory?.[1]?.toFixed(1)||0}kg CO₂.`,
        'Try replacing 2 meat meals/week with plant-based options to save ~6kg CO₂/week.',
        'Carpooling or using public transport once a week can cut transport emissions by 20%.',
        `You logged ${total.toFixed(1)}kg CO₂ this month. Global average is ~333kg/month.`,
        'Setting a weekly CO₂ budget helps build lasting habits — try 50kg/week as a goal.',
      ]}})
    }
  } catch (err) { next(err) }
})

// GET /api/v1/ai/recommendations
router.get('/recommendations', auth, async (req, res, next) => {
  try {
    const { vehicleType, dietType, energySource } = req.user.profile || {}
    const recs = []
    if (vehicleType === 'gasoline' || vehicleType === 'diesel')
      recs.push({ title: 'Switch to Public Transit', impact: 'High', saving: '~500 kg CO₂/year', icon: '🚌', category: 'transport' })
    if (!['vegan','vegetarian'].includes(dietType))
      recs.push({ title: 'Try Meatless Mondays', impact: 'High', saving: '~260 kg CO₂/year', icon: '🥗', category: 'food' })
    if (energySource === 'fossil')
      recs.push({ title: 'Switch to Green Energy Provider', impact: 'High', saving: '~1000 kg CO₂/year', icon: '☀️', category: 'energy' })
    recs.push(
      { title: 'Buy Local & Seasonal Food', impact: 'Medium', saving: '~150 kg CO₂/year', icon: '🌽', category: 'food' },
      { title: 'Reduce Home Heating by 1°C', impact: 'Medium', saving: '~230 kg CO₂/year', icon: '🏠', category: 'energy' },
      { title: 'Choose Second-Hand Clothing', impact: 'Medium', saving: '~60 kg CO₂/item', icon: '👕', category: 'shopping' }
    )
    res.json({ success: true, data: recs.slice(0, 5) })
  } catch (err) { next(err) }
})

// POST /api/v1/ai/parse-activity (NLP logger)
router.post('/parse-activity', auth, async (req, res, next) => {
  try {
    const { text } = req.body
    if (!text?.trim()) return res.status(400).json({ success: false, error: { message: 'Text required' } })

    try {
      const genAI = getGemini()
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      const prompt = `Parse this activity description into structured data. Return ONLY valid JSON with fields: category (transport/food/energy/shopping/waste), subcategory, quantity (number), unit. Valid subcategories for transport: car_gasoline,car_ev,bus,train,motorcycle,cycling. For food: beef,chicken,vegetables,fruits,grains,dairy. For energy: electricity_mix,natural_gas. Input: "${text}"`
      const result = await model.generateContent(prompt)
      const raw    = result.response.text()
      const match  = raw.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('No JSON')
      const parsed = JSON.parse(match[0])
      res.json({ success: true, data: parsed })
    } catch {
      // Fallback: simple regex parsing
      const kmMatch = text.match(/(\d+\.?\d*)\s*(km|kilometer|mile)/i)
      const kgMatch = text.match(/(\d+\.?\d*)\s*(kg|kilogram|gram|g)\s*(of\s+)?(\w+)/i)
      if (kmMatch) {
        res.json({ success: true, data: { category: 'transport', subcategory: 'car_gasoline', quantity: parseFloat(kmMatch[1]), unit: 'km' } })
      } else if (kgMatch) {
        res.json({ success: true, data: { category: 'food', subcategory: kgMatch[4].toLowerCase().includes('beef') ? 'beef' : 'chicken', quantity: parseFloat(kgMatch[1]), unit: 'kg' } })
      } else {
        res.status(422).json({ success: false, error: { message: 'Could not parse activity. Try: "drove 20km to work" or "ate 200g chicken"' } })
      }
    }
  } catch (err) { next(err) }
})

module.exports = router 
