import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import { EMISSION_FACTORS, CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/constants'
import { formatCO2, getImpactLevel } from '../utils/formatters'
import { Car, Utensils, Zap, ShoppingBag, Trash2, Send, Sparkles, X } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function CalculatorPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const initialCategory = searchParams.get('category') || 'transport'
  
  const [category, setCategory] = useState(initialCategory)
  const [subcategory, setSubcategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  
  const [nlpText, setNlpText] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentLogs, setRecentLogs] = useState([])
  const [co2Preview, setCo2Preview] = useState(0)

  // Subcategories for selected category
  const subcats = Object.entries(EMISSION_FACTORS[category] || {})
  
  // Set default subcategory when category changes
  useEffect(() => {
    if (subcats.length > 0) {
      setSubcategory(subcats[0][0])
      setQuantity('')
    }
  }, [category])

  // Calculate live preview
  useEffect(() => {
    if (subcategory && quantity && !isNaN(quantity)) {
      const factor = EMISSION_FACTORS[category][subcategory].factor
      setCo2Preview(factor * parseFloat(quantity))
    } else {
      setCo2Preview(0)
    }
  }, [category, subcategory, quantity])

  const fetchRecent = async () => {
    try {
      const res = await api.get('/activities?limit=5')
      setRecentLogs(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchRecent()
  }, [])

  const handleNlpSubmit = async (e) => {
    e.preventDefault()
    if (!nlpText.trim()) return
    
    setIsParsing(true)
    try {
      const res = await api.post('/ai/parse-activity', { text: nlpText })
      const { category: c, subcategory: s, quantity: q } = res.data.data
      
      setCategory(c)
      setTimeout(() => {
        setSubcategory(s)
        setQuantity(q.toString())
        setDescription(nlpText)
        setNlpText('')
        toast.success('Activity parsed successfully!')
      }, 50)
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Could not parse activity. Try being more specific.')
    } finally {
      setIsParsing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!subcategory || !quantity || quantity <= 0) {
      return toast.error('Please enter a valid quantity')
    }

    setIsSubmitting(true)
    try {
      await api.post('/activities', {
        category,
        subcategory,
        quantity: parseFloat(quantity),
        description,
        date
      })
      toast.success('Activity logged successfully!')
      setQuantity('')
      setDescription('')
      fetchRecent()
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to log activity')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/activities/${id}`)
      toast.success('Activity deleted')
      fetchRecent()
    } catch (err) {
      toast.error('Failed to delete activity')
    }
  }

  const impact = getImpactLevel(co2Preview)
  const currentUnit = EMISSION_FACTORS[category]?.[subcategory]?.unit || ''

  const cats = [
    { id: 'transport', icon: Car, label: 'Transport', color: 'sky' },
    { id: 'food', icon: Utensils, label: 'Food', color: 'eco' },
    { id: 'energy', icon: Zap, label: 'Energy', color: 'amber' },
    { id: 'shopping', icon: ShoppingBag, label: 'Shopping', color: 'violet' },
    { id: 'waste', icon: Trash2, label: 'Waste', color: 'red' },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      <Sidebar />
      <div className="ml-64 flex-1 overflow-y-auto p-4 sm:p-8">
        
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-2xl font-bold text-white">Carbon Calculator</h1>
          <p className="text-gray-400 text-sm mt-1">Log your activities and track your CO₂ impact</p>
        </div>

        {/* NLP Quick Log */}
        <Card className="mb-8 animate-fade-up border-eco-500/30 bg-gradient-to-r from-eco-900/10 to-surface-800">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-eco-400" />
                <span className="font-bold text-white">AI Quick Log</span>
              </div>
              <form onSubmit={handleNlpSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={nlpText}
                  onChange={(e) => setNlpText(e.target.value)}
                  placeholder="Describe your activity... (e.g. 'drove 20km to work' or 'ate a beef burger')"
                  className="flex-1 bg-surface-950 border border-eco-900/40 rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-eco-500 transition-colors"
                />
                <Button type="submit" loading={isParsing} icon={Send}>
                  Parse
                </Button>
              </form>
            </div>
          </div>
        </Card>

        {/* Category Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
          {cats.map(cat => {
            const isSelected = category === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
                  isSelected 
                    ? `border-${cat.color}-500 bg-${cat.color}-500/10 text-${cat.color}-400 scale-105 shadow-lg shadow-${cat.color}-500/20` 
                    : `border-surface-700 bg-surface-800 text-gray-400 hover:border-${cat.color}-500/50 hover:bg-${cat.color}-500/5`
                }`}
              >
                <cat.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
          
          {/* Form */}
          <Card className="h-fit">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">{CATEGORY_ICONS[category]}</span> Log {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Activity Type</label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full bg-surface-700 border border-eco-900/40 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-eco-500 appearance-none"
                >
                  {subcats.map(([key, data]) => (
                    <option key={key} value={key}>{data.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-surface-700 border border-eco-900/40 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-eco-500"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Badge variant="gray">{currentUnit}</Badge>
                  </div>
                </div>
              </div>

              <Input
                label="Date"
                type="date"
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
              />

              <Input
                label="Description (Optional)"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Morning commute"
              />

              <Button type="submit" className="w-full mt-4" loading={isSubmitting}>
                Log Activity
              </Button>
            </form>
          </Card>

          {/* Preview & Recent Logs */}
          <div className="space-y-6">
            <Card glow className="flex flex-col items-center justify-center text-center p-8 bg-surface-900 border-eco-500/20 h-[320px]">
              <div className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Estimated Impact</div>
              
              <div className="mb-6">
                <span className="font-display text-6xl font-black gradient-text">{co2Preview > 0 ? formatCO2(co2Preview).split(' ')[0] : '0.0'}</span>
                <span className="text-xl text-gray-400 ml-2">{co2Preview > 0 ? formatCO2(co2Preview).split(' ').slice(1).join(' ') : 'kg CO₂e'}</span>
              </div>

              {co2Preview > 0 ? (
                <div className="space-y-4 w-full">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${impact.bg} ${impact.color} ${impact.border}`}>
                    {impact.label} Impact
                  </div>
                  <div className="text-sm text-gray-400 border-t border-surface-700 pt-4 mt-2">
                    {co2Preview > 10.96 
                      ? "⚠️ This single activity exceeds the global daily average (10.96 kg)." 
                      : "✅ This is below the global daily average."}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Fill in the quantity to see the carbon impact of this activity.</p>
              )}
            </Card>

            <Card>
              <h3 className="font-bold text-white mb-4">Recent Logs</h3>
              {recentLogs.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No activities logged yet today.
                </div>
              ) : (
                <div className="space-y-2">
                  {recentLogs.map((log) => (
                    <div key={log._id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-surface-700/50 transition-colors border border-transparent hover:border-surface-600">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: CATEGORY_COLORS[log.category] + '20' }}>
                          {CATEGORY_ICONS[log.category]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{log.description || EMISSION_FACTORS[log.category]?.[log.subcategory]?.label || log.subcategory}</div>
                          <div className="text-xs text-gray-400">{log.quantity} {log.unit}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="gray">{formatCO2(log.co2Equivalent)}</Badge>
                        <button 
                          onClick={() => handleDelete(log._id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
