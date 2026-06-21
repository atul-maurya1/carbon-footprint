import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { Eye, EyeOff, Mail, Lock, User, ChevronRight, ChevronLeft, Check, Globe, Users, Car, Leaf, Target, Brain } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'US',
    householdSize: 1,
    dietType: 'omnivore',
    vehicleType: 'gasoline',
    goal: 'reduce_20',
  })

  const handleNext = () => {
    if (step === 1) {
      if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
        return toast.error('All fields are required')
      }
      if (formData.password.length < 8) {
        return toast.error('Password must be at least 8 characters')
      }
      if (formData.password !== formData.confirmPassword) {
        return toast.error('Passwords do not match')
      }
    }
    setStep((s) => s + 1)
  }

  const handleBack = () => {
    setStep((s) => s - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (step < 3) return handleNext()
    
    setLoading(true)
    try {
      await register({
        displayName: formData.displayName,
        email: formData.email,
        password: formData.password,
      })
      toast.success('Registration successful!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex min-h-screen bg-surface-950">
      {/* Left Decorative Panel (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-gradient-to-br from-eco-900 via-surface-900 to-surface-950">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-eco-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lime-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <div className="w-10 h-10 rounded-xl bg-eco-500/10 flex items-center justify-center border border-eco-500/20 group-hover:bg-eco-500/20 transition-colors">
              <Leaf className="w-6 h-6 text-eco-400" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">EcoGuide AI</span>
          </Link>
        </div>

        <div className="relative z-10 mt-12">
          <h1 className="text-4xl lg:text-5xl font-black font-display text-white leading-tight mb-6">
            Join the movement to <br />
            <span className="gradient-text">protect our planet.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-md">
            Create your account today and start tracking, understanding, and reducing your carbon footprint with AI-powered insights.
          </p>
          
          <div className="space-y-4">
            {[
              { icon: Target, text: 'Personalized reduction goals' },
              { icon: Brain, text: 'AI-powered eco coaching' },
              { icon: Users, text: 'Community challenges and leaderboards' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-eco-500/10 flex items-center justify-center border border-eco-500/20">
                  <item.icon className="w-4 h-4 text-eco-400" />
                </div>
                <span className="text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex gap-8 border-t border-eco-900/30 pt-8 mt-12">
          <div>
            <div className="text-2xl font-bold text-white font-display">12K+</div>
            <div className="text-gray-500 text-sm">Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-display">47.3t</div>
            <div className="text-gray-500 text-sm">CO₂ Reduced</div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-eco-400" />
              <span className="font-display font-bold text-2xl text-white">EcoGuide AI</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-white mb-2">Create an account</h2>
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-eco-400 hover:text-eco-300 font-medium">
                Log in
              </Link>
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-700 -z-10 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 h-0.5 bg-eco-500 -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
            
            {[1, 2, 3].map((num) => (
              <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= num ? 'bg-eco-500 text-surface-950' : 'bg-surface-800 text-gray-500 border border-surface-600'}`}>
                {step > num ? <Check className="w-4 h-4" /> : num}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: Account Details */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-up">
                <Input
                  label="Display Name"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Eco Warrior"
                  icon={User}
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  icon={Mail}
                  required
                />
                <div className="relative">
                  <Input
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={Lock}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={Lock}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Lifestyle Profile */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-up">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-surface-700 border border-eco-900/40 rounded-xl py-3 pl-10 pr-4 text-gray-100 focus:outline-none focus:border-eco-500 focus:ring-1 focus:ring-eco-500 appearance-none"
                    >
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="IN">India</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Household Size</label>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => setField('householdSize', Math.max(1, formData.householdSize - 1))} className="w-10 h-10 rounded-lg bg-surface-700 border border-eco-900/40 flex items-center justify-center text-gray-300 hover:bg-surface-600">-</button>
                    <span className="text-xl font-bold w-8 text-center">{formData.householdSize}</span>
                    <button type="button" onClick={() => setField('householdSize', formData.householdSize + 1)} className="w-10 h-10 rounded-lg bg-surface-700 border border-eco-900/40 flex items-center justify-center text-gray-300 hover:bg-surface-600">+</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primary Diet</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'vegan', label: 'Vegan' },
                      { id: 'vegetarian', label: 'Vegetarian' },
                      { id: 'omnivore', label: 'Omnivore' },
                      { id: 'carnivore', label: 'Meat-Heavy' },
                    ].map(diet => (
                      <button
                        key={diet.id}
                        type="button"
                        onClick={() => setField('dietType', diet.id)}
                        className={`p-3 rounded-xl border text-sm transition-all ${formData.dietType === diet.id ? 'bg-eco-500/20 border-eco-500 text-eco-400' : 'bg-surface-800 border-surface-600 text-gray-400 hover:border-gray-500'}`}
                      >
                        {diet.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primary Vehicle</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'none', label: 'No Car' },
                      { id: 'ev', label: 'Electric' },
                      { id: 'hybrid', label: 'Hybrid' },
                      { id: 'gasoline', label: 'Gasoline' },
                      { id: 'diesel', label: 'Diesel' },
                    ].map(veh => (
                      <button
                        key={veh.id}
                        type="button"
                        onClick={() => setField('vehicleType', veh.id)}
                        className={`p-3 rounded-xl border text-sm transition-all ${formData.vehicleType === veh.id ? 'bg-eco-500/20 border-eco-500 text-eco-400' : 'bg-surface-800 border-surface-600 text-gray-400 hover:border-gray-500'}`}
                      >
                        {veh.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Goals */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-up">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-eco-500/20 text-eco-400 mb-4">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Set Your Reduction Goal</h3>
                  <p className="text-gray-400 text-sm">Choose a realistic target to reduce your carbon footprint over the next 12 months.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'maintain', label: 'Maintain Current', desc: 'I just want to track for now.', icon: '👀' },
                    { id: 'reduce_10', label: '10% Reduction', desc: 'A modest, easy-to-achieve goal.', icon: '🌱' },
                    { id: 'reduce_20', label: '20% Reduction', desc: 'A solid commitment to change.', icon: '🌿' },
                    { id: 'reduce_50', label: '50% Reduction', desc: 'Aggressive lifestyle overhaul.', icon: '🌍' },
                  ].map(goal => (
                    <Card
                      key={goal.id}
                      hover
                      className={`cursor-pointer transition-all ${formData.goal === goal.id ? 'border-eco-500 bg-eco-500/5' : ''}`}
                      onClick={() => setField('goal', goal.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{goal.icon}</div>
                        <div>
                          <div className={`font-bold ${formData.goal === goal.id ? 'text-eco-400' : 'text-gray-200'}`}>{goal.label}</div>
                          <div className="text-sm text-gray-400">{goal.desc}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleBack}
                  icon={ChevronLeft}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 flex justify-center items-center gap-2"
                loading={loading}
              >
                {step < 3 ? (
                  <>Next Step <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <>Complete Setup <Check className="w-4 h-4" /></>
                )}
              </Button>
            </div>
            
            {step === 1 && (
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-700"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-surface-950 text-gray-500">Or continue with</span></div>
              </div>
            )}
            
            {step === 1 && (
              <Button type="button" variant="outline" className="w-full flex justify-center items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
