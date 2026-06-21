// src/pages/OnboardingPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Car, Utensils, Zap, Target, ChevronRight, ChevronLeft, Leaf, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const STEPS = [
  { icon: MapPin, label: 'Location', title: 'Where are you based?' },
  { icon: Car, label: 'Transport', title: 'How do you get around?' },
  { icon: Utensils, label: 'Diet', title: 'What do you eat?' },
  { icon: Zap, label: 'Energy', title: 'Your home energy' },
  { icon: Target, label: 'Goals', title: 'Set your target' },
]

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'India', 'Japan', 'Brazil', 'South Korea', 'Netherlands',
  'Sweden', 'Norway', 'Singapore', 'Other',
]

const VEHICLE_OPTIONS = [
  { value: 'none', label: 'No Car', emoji: '🚶', desc: 'Walk, bike, or public transit' },
  { value: 'ev', label: 'Electric', emoji: '⚡', desc: 'Fully electric vehicle' },
  { value: 'hybrid', label: 'Hybrid', emoji: '🔋', desc: 'Hybrid electric vehicle' },
  { value: 'gasoline', label: 'Gasoline', emoji: '⛽', desc: 'Gas-powered vehicle' },
  { value: 'diesel', label: 'Diesel', emoji: '🛢️', desc: 'Diesel-powered vehicle' },
]

const DIET_OPTIONS = [
  { value: 'vegan', label: 'Vegan', emoji: '🌱', desc: 'No animal products', co2: '~1,500 kg/yr' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥚', desc: 'No meat or fish', co2: '~1,700 kg/yr' },
  { value: 'omnivore', label: 'Omnivore', emoji: '🍽️', desc: 'Mixed diet with some meat', co2: '~2,500 kg/yr' },
  { value: 'carnivore', label: 'Carnivore', emoji: '🥩', desc: 'Meat-heavy diet', co2: '~3,300 kg/yr' },
]

const HOME_OPTIONS = [
  { value: 'apartment', label: 'Apartment', emoji: '🏢' },
  { value: 'house', label: 'House', emoji: '🏠' },
  { value: 'condo', label: 'Condo', emoji: '🏘️' },
]

const ENERGY_OPTIONS = [
  { value: 'renewable', label: 'Renewable', emoji: '☀️', desc: 'Solar, wind, hydro' },
  { value: 'mixed', label: 'Mixed Grid', emoji: '⚡', desc: 'Standard utility mix' },
  { value: 'fossil', label: 'Fossil Fuel', emoji: '🏭', desc: 'Coal, gas, oil' },
]

const GOAL_OPTIONS = [
  { value: 'reduce_10', label: '10% reduction', emoji: '🌱', desc: 'Start small, build habits' },
  { value: 'reduce_20', label: '20% reduction', emoji: '🌿', desc: 'Meaningful change' },
  { value: 'reduce_30', label: '30% reduction', emoji: '🌳', desc: 'Ambitious target' },
  { value: 'carbon_neutral', label: 'Carbon neutral', emoji: '🌍', desc: 'Net-zero emissions' },
]

function estimateBaseline(form) {
  let annual = 0
  // Transport
  const kmFactors = { none: 0, ev: 0.053, hybrid: 0.111, gasoline: 0.192, diesel: 0.171 }
  annual += (kmFactors[form.vehicleType] || 0) * (form.commuteKm || 0) * (form.commuteFrequency || 0) * 52
  // Diet
  const dietFactors = { vegan: 1500, vegetarian: 1700, omnivore: 2500, carnivore: 3300 }
  annual += dietFactors[form.dietType] || 2500
  // Energy
  const energyFactors = { renewable: 0.05, mixed: 0.43, fossil: 0.82 }
  annual += (energyFactors[form.energySource] || 0.43) * (form.monthlyKwh || 300) * 12
  return Math.round(annual)
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    country: 'United States',
    householdSize: 2,
    vehicleType: 'gasoline',
    commuteKm: 15,
    commuteFrequency: 5,
    dietType: 'omnivore',
    homeType: 'apartment',
    energySource: 'mixed',
    monthlyKwh: 300,
    goal: 'reduce_20',
  })

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
  const baseline = estimateBaseline(form)
  const globalAvg = 4000

  const handleComplete = async () => {
    setLoading(true)
    try {
      const res = await api.put('/users/onboarding', form)
      updateUser(res.data.data)
      toast.success('Welcome aboard! Let\'s start reducing your footprint 🌿')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to save — please try again')
    } finally {
      setLoading(false)
    }
  }

  const canNext = step < STEPS.length - 1
  const canPrev = step > 0
  const isLast = step === STEPS.length - 1

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-eco-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-eco-500/20">
            <Leaf size={28} className="text-surface-950" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-100">
            Set up your <span className="gradient-text">EcoGuide</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Tell us about your lifestyle so we can personalize your experience</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => {
            const StepIcon = s.icon
            return (
              <button
                key={i}
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                  i === step
                    ? 'bg-eco-500/15 border border-eco-500/30 text-eco-400'
                    : i < step
                    ? 'bg-eco-500/8 border border-eco-500/15 text-eco-500/70 cursor-pointer hover:bg-eco-500/12'
                    : 'bg-surface-800 border border-eco-900/40 text-gray-600'
                }`}
              >
                {i < step ? <Check size={12} /> : <StepIcon size={12} />}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            )
          })}
        </div>

        {/* Step Content */}
        <Card className="animate-fade-up !bg-surface-800/80 backdrop-blur-sm">
          <h2 className="font-display text-xl font-bold text-gray-100 mb-1">{STEPS[step].title}</h2>
          <p className="text-gray-500 text-sm mb-6">Step {step + 1} of {STEPS.length}</p>

          {/* Step 0 — Location */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Country</label>
                <select
                  value={form.country}
                  onChange={(e) => set('country', e.target.value)}
                  className="w-full bg-surface-700 text-gray-100 rounded-xl border border-eco-900/40 px-4 py-3 text-sm outline-none focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20 transition-all"
                >
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Household size: <span className="text-eco-400 font-bold">{form.householdSize}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.householdSize}
                  onChange={(e) => set('householdSize', +e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1 person</span>
                  <span>10 people</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Transport */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {VEHICLE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set('vehicleType', opt.value)}
                    className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border text-center transition-all duration-200 ${
                      form.vehicleType === opt.value
                        ? 'border-eco-500/50 bg-eco-500/10 text-eco-400 shadow-lg shadow-eco-500/5'
                        : 'border-eco-900/30 bg-surface-700/50 text-gray-400 hover:border-eco-900/50'
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-xs font-semibold">{opt.label}</span>
                    <span className="text-[10px] text-gray-500">{opt.desc}</span>
                  </button>
                ))}
              </div>
              {form.vehicleType !== 'none' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Daily commute (km)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.commuteKm}
                      onChange={(e) => set('commuteKm', +e.target.value)}
                      className="w-full bg-surface-700 text-gray-100 rounded-xl border border-eco-900/40 px-4 py-2.5 text-sm outline-none focus:border-eco-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Days per week</label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={form.commuteFrequency}
                      onChange={(e) => set('commuteFrequency', +e.target.value)}
                      className="w-full bg-surface-700 text-gray-100 rounded-xl border border-eco-900/40 px-4 py-2.5 text-sm outline-none focus:border-eco-500 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2 — Diet */}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {DIET_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('dietType', opt.value)}
                  className={`flex flex-col items-center gap-2 p-5 rounded-xl border text-center transition-all duration-200 ${
                    form.dietType === opt.value
                      ? 'border-eco-500/50 bg-eco-500/10 text-eco-400 shadow-lg shadow-eco-500/5'
                      : 'border-eco-900/30 bg-surface-700/50 text-gray-400 hover:border-eco-900/50'
                  }`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="text-sm font-semibold">{opt.label}</span>
                  <span className="text-[10px] text-gray-500">{opt.desc}</span>
                  <span className="text-[10px] text-eco-400/60 font-medium">{opt.co2}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 3 — Energy */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Home type</label>
                <div className="grid grid-cols-3 gap-2">
                  {HOME_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set('homeType', opt.value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${
                        form.homeType === opt.value
                          ? 'border-eco-500/50 bg-eco-500/10 text-eco-400'
                          : 'border-eco-900/30 bg-surface-700/50 text-gray-400 hover:border-eco-900/50'
                      }`}
                    >
                      <span className="text-xl">{opt.emoji}</span>
                      <span className="text-xs font-semibold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Energy source</label>
                <div className="grid grid-cols-3 gap-2">
                  {ENERGY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set('energySource', opt.value)}
                      className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all duration-200 ${
                        form.energySource === opt.value
                          ? 'border-eco-500/50 bg-eco-500/10 text-eco-400'
                          : 'border-eco-900/30 bg-surface-700/50 text-gray-400 hover:border-eco-900/50'
                      }`}
                    >
                      <span className="text-xl">{opt.emoji}</span>
                      <span className="text-xs font-semibold">{opt.label}</span>
                      <span className="text-[10px] text-gray-500">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Monthly electricity: <span className="text-eco-400 font-bold">{form.monthlyKwh} kWh</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="50"
                  value={form.monthlyKwh}
                  onChange={(e) => set('monthlyKwh', +e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>50 kWh</span>
                  <span>1,500 kWh</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Goals */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Baseline Estimate */}
              <div className="text-center p-5 rounded-xl bg-surface-700/50 border border-eco-900/30 mb-4">
                <p className="text-xs text-gray-500 mb-1">Your estimated annual footprint</p>
                <p className="font-display text-4xl font-bold text-gray-100 mb-1">
                  {(baseline / 1000).toFixed(1)} <span className="text-lg text-gray-400">t CO₂</span>
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="h-2 flex-1 max-w-[200px] bg-surface-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        baseline < globalAvg ? 'bg-eco-500' : baseline < globalAvg * 1.5 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${Math.min((baseline / (globalAvg * 2)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500">
                    Global avg: {(globalAvg / 1000).toFixed(1)}t
                  </span>
                </div>
                <p className="text-xs mt-2">
                  {baseline < globalAvg ? (
                    <span className="text-eco-400">✓ Below global average — great start!</span>
                  ) : (
                    <span className="text-amber-400">Above global average — lots of room to improve!</span>
                  )}
                </p>
              </div>

              {/* Goal Selection */}
              <div className="grid grid-cols-2 gap-3">
                {GOAL_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set('goal', opt.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all duration-200 ${
                      form.goal === opt.value
                        ? 'border-eco-500/50 bg-eco-500/10 text-eco-400 shadow-lg shadow-eco-500/5'
                        : 'border-eco-900/30 bg-surface-700/50 text-gray-400 hover:border-eco-900/50'
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-sm font-semibold">{opt.label}</span>
                    <span className="text-[10px] text-gray-500">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-eco-900/30">
            {canPrev ? (
              <Button variant="ghost" onClick={() => setStep(s => s - 1)} icon={ChevronLeft}>
                Back
              </Button>
            ) : <div />}

            {isLast ? (
              <Button onClick={handleComplete} loading={loading} icon={Check}>
                Complete Setup
              </Button>
            ) : (
              <Button onClick={() => setStep(s => s + 1)} icon={ChevronRight}>
                Next
              </Button>
            )}
          </div>
        </Card>

        {/* Skip link */}
        <p className="text-center mt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Skip for now →
          </button>
        </p>
      </div>
    </div>
  )
}
