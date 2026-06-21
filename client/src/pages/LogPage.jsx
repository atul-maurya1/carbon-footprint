// src/pages/LogPage.jsx
import { useState, useEffect, useCallback } from 'react'
import { Sparkles, Plus, Trash2, Calendar, FileText, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import api from '../services/api'
import { EMISSION_FACTORS, CATEGORY_META } from '../utils/constants'
import { formatCO2, formatRelative, getImpactLevel } from '../utils/formatters'

const categories = Object.keys(EMISSION_FACTORS)

export default function LogPage() {
  // ── NLP state ──
  const [nlpText, setNlpText] = useState('')
  const [nlpLoading, setNlpLoading] = useState(false)

  // ── Form state ──
  const [category, setCategory] = useState('transport')
  const [subcategory, setSubcategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ── Recent activities ──
  const [activities, setActivities] = useState([])
  const [loadingActivities, setLoadingActivities] = useState(true)

  // Set default subcategory when category changes
  useEffect(() => {
    const subs = Object.keys(EMISSION_FACTORS[category] || {})
    setSubcategory(subs[0] || '')
  }, [category])

  // Fetch recent activities
  const fetchActivities = useCallback(async () => {
    try {
      const res = await api.get('/activities?limit=10')
      setActivities(res.data.data || [])
    } catch {
      // silent fail — will show empty
    } finally {
      setLoadingActivities(false)
    }
  }, [])

  useEffect(() => { fetchActivities() }, [fetchActivities])

  // ── Computed CO₂ ──
  const factor = EMISSION_FACTORS[category]?.[subcategory]
  const co2 = factor && quantity ? +(factor.factor * +quantity).toFixed(4) : 0
  const impact = getImpactLevel(co2)

  // ── NLP Parse ──
  const handleNlpParse = async () => {
    if (!nlpText.trim()) return
    setNlpLoading(true)
    try {
      const res = await api.post('/ai/parse-activity', { text: nlpText })
      const d = res.data.data
      if (d.category && EMISSION_FACTORS[d.category]) setCategory(d.category)
      if (d.subcategory) setSubcategory(d.subcategory)
      if (d.quantity) setQuantity(String(d.quantity))
      toast.success('Activity parsed! Review and submit below.')
      setNlpText('')
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Could not parse activity')
    } finally {
      setNlpLoading(false)
    }
  }

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!subcategory || !quantity || +quantity <= 0) {
      toast.error('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/activities', {
        category,
        subcategory,
        quantity: +quantity,
        unit: factor?.unit || 'unit',
        date,
        description,
        source: 'manual',
      })
      toast.success(`Logged ${formatCO2(co2)} — great tracking!`)
      setQuantity('')
      setDescription('')
      fetchActivities()
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to log activity')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Delete ──
  const handleDelete = async (id) => {
    try {
      await api.delete(`/activities/${id}`)
      setActivities(prev => prev.filter(a => a._id !== id))
      toast.success('Activity deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const subcategories = Object.entries(EMISSION_FACTORS[category] || {})

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen bg-surface-950 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-100">
            Log <span className="gradient-text">Activity</span>
          </h1>
          <p className="text-gray-400 mt-1">Track your carbon footprint by logging daily activities</p>
        </div>

        {/* AI Quick Log */}
        <Card className="mb-6 !bg-surface-800/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-eco-500/15 flex items-center justify-center">
              <Sparkles size={16} className="text-eco-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-100">AI Quick Log</h3>
              <p className="text-xs text-gray-500">Describe your activity in natural language</p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={nlpText}
              onChange={(e) => setNlpText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNlpParse()}
              placeholder='Try: "drove 15km to work" or "ate 300g beef for dinner"'
              className="flex-1 bg-surface-700 text-gray-100 placeholder-gray-500 rounded-xl border border-eco-900/40 px-4 py-2.5 text-sm outline-none focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20 transition-all"
            />
            <Button onClick={handleNlpParse} loading={nlpLoading} icon={Sparkles} size="md">
              Parse
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Manual Form */}
          <div className="xl:col-span-2">
            <Card>
              <h3 className="font-display text-lg font-semibold text-gray-100 mb-5">Manual Entry</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category Selector */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
                  <div className="grid grid-cols-5 gap-2">
                    {categories.map((cat) => {
                      const meta = CATEGORY_META[cat]
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all duration-200 ${
                            category === cat
                              ? 'border-eco-500/50 bg-eco-500/10 text-eco-400 shadow-lg shadow-eco-500/5'
                              : 'border-eco-900/30 bg-surface-700/50 text-gray-400 hover:border-eco-900/50 hover:bg-surface-700'
                          }`}
                        >
                          <span className="text-lg">{meta?.emoji}</span>
                          <span>{meta?.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Subcategory */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Activity Type</label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full bg-surface-700 text-gray-100 rounded-xl border border-eco-900/40 px-4 py-2.5 text-sm outline-none focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20 transition-all"
                  >
                    {subcategories.map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity + Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Quantity</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0"
                      className="w-full bg-surface-700 text-gray-100 placeholder-gray-500 rounded-xl border border-eco-900/40 px-4 py-2.5 text-sm outline-none focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Unit</label>
                    <div className="bg-surface-700/50 text-gray-400 rounded-xl border border-eco-900/40 px-4 py-2.5 text-sm">
                      {factor?.unit || '—'}
                    </div>
                  </div>
                </div>

                {/* Date + Description */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-1.5">
                      <Calendar size={14} /> Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-surface-700 text-gray-100 rounded-xl border border-eco-900/40 px-4 py-2.5 text-sm outline-none focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-1.5">
                      <FileText size={14} /> Note (optional)
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a note..."
                      className="w-full bg-surface-700 text-gray-100 placeholder-gray-500 rounded-xl border border-eco-900/40 px-4 py-2.5 text-sm outline-none focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Live CO₂ Preview */}
                {quantity && +quantity > 0 && (
                  <div className={`flex items-center justify-between p-4 rounded-xl border ${impact.border} ${impact.bg} transition-all duration-300`}>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Estimated emissions</p>
                      <p className="font-display text-2xl font-bold text-gray-100">{formatCO2(co2)}</p>
                    </div>
                    <Badge variant={co2 < 5 ? 'green' : co2 < 15 ? 'amber' : 'red'}>
                      {impact.label} Impact
                    </Badge>
                  </div>
                )}

                {/* Submit */}
                <Button type="submit" loading={submitting} icon={Plus} className="w-full">
                  Log Activity
                </Button>
              </form>
            </Card>
          </div>

          {/* Recent Activities */}
          <div>
            <h3 className="font-display text-lg font-semibold text-gray-100 mb-4">Recent Logs</h3>
            <div className="space-y-2">
              {loadingActivities ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-eco-400" size={24} />
                </div>
              ) : activities.length === 0 ? (
                <Card className="!py-10 text-center">
                  <p className="text-gray-500 text-sm">No activities logged yet.</p>
                  <p className="text-gray-600 text-xs mt-1">Start tracking to see your impact!</p>
                </Card>
              ) : (
                activities.map((act) => (
                  <Card key={act._id} hover className="!p-4 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="text-lg shrink-0 mt-0.5">{CATEGORY_META[act.category]?.emoji || '📦'}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-100 truncate">
                            {EMISSION_FACTORS[act.category]?.[act.subcategory]?.label || act.subcategory}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {act.quantity} {act.unit} · {formatRelative(act.date)}
                          </p>
                          {act.description && (
                            <p className="text-xs text-gray-600 mt-0.5 truncate">{act.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-semibold text-gray-300">{formatCO2(act.co2Equivalent)}</span>
                        <button
                          onClick={() => handleDelete(act._id)}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Delete activity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
