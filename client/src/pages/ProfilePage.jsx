import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import StatCard from '../components/ui/StatCard'
import ProgressBar from '../components/ui/ProgressBar'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { Edit3, Camera, Flame, Star, Shield, Award, Settings, Bell, Trash2, ChevronRight, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const MOCK_BADGES = [
  { id: 1, icon: '🌱', name: 'First Log', desc: 'Logged your first activity', rarity: 'common', earned: true },
  { id: 2, icon: '🔥', name: 'Week Streak', desc: '7 consecutive days logged', rarity: 'rare', earned: true },
  { id: 3, icon: '🌍', name: 'CO₂ Saver', desc: 'Saved 50kg of CO₂', rarity: 'rare', earned: true },
  { id: 4, icon: '🏆', name: 'Challenger', desc: 'Completed a community challenge', rarity: 'epic', earned: true },
  { id: 5, icon: '🥗', name: 'Plant-Lover', desc: 'Logged 10 vegan meals', rarity: 'common', earned: false },
  { id: 6, icon: '🚲', name: 'Eco Driver', desc: '100km without a car', rarity: 'epic', earned: false },
  { id: 7, icon: '☀️', name: 'Solar Star', desc: 'Switched to renewable energy', rarity: 'legendary', earned: false },
  { id: 8, icon: '⭐', name: 'Guardian', desc: 'Reached max level', rarity: 'legendary', earned: false },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Overview')
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  
  // Use mock or user data
  const initials = user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'EX'
  const name = user?.displayName || 'Eco Warrior'
  const email = user?.email || 'user@example.com'
  const level = user?.stats?.level || 3
  const xp = user?.stats?.xp || 780

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      <Sidebar />
      <div className="ml-64 flex-1 overflow-y-auto p-4 sm:p-8">
        
        {/* Profile Hero */}
        <Card className="mb-8 p-8 bg-gradient-to-r from-eco-900/40 via-surface-800 to-surface-800 border-eco-500/20 animate-fade-up">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center text-surface-950 font-black text-3xl font-display shadow-lg shadow-eco-500/20">
                  {initials}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-display font-bold text-white mb-1">{name}</h1>
                <p className="text-gray-400 mb-4">{email}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge variant="green">Level {level} Sprout</Badge>
                  <Badge variant="amber" icon={Flame}>7 Day Streak</Badge>
                  <Badge variant="blue" icon={Award}>Top 20%</Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" icon={Edit3}>
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Level & XP */}
        <Card className="mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="flex justify-between items-end mb-2">
            <h3 className="font-bold text-white">Experience Points</h3>
            <span className="text-eco-400 font-bold">{xp} / 1000 XP</span>
          </div>
          <ProgressBar value={78} color="eco" showPercent={false} />
          <p className="text-gray-400 text-sm mt-3">Only 220 XP left to reach Level 4 — Leafy 🍃</p>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-up" style={{ animationDelay: '150ms' }}>
          <StatCard label="CO₂ Saved" value="47.3 kg" icon={Star} color="eco" />
          <StatCard label="Current Streak" value="7 Days" icon={Flame} color="amber" />
          <StatCard label="Total XP" value="780" icon={Award} color="blue" />
          <StatCard label="Badges Earned" value="4" icon={Shield} color="purple" />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-surface-700 mb-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
          {['Overview', 'Badges', 'Settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab ? 'text-eco-400 border-eco-400' : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-up" style={{ animationDelay: '250ms' }}>
          
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-bold text-white mb-6">Lifestyle Profile</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Country', value: user?.profile?.country || 'United States' },
                    { label: 'Household Size', value: user?.profile?.householdSize || '1 Person' },
                    { label: 'Diet Type', value: user?.profile?.dietType || 'Omnivore' },
                    { label: 'Primary Vehicle', value: user?.profile?.vehicleType || 'Gasoline Car' },
                    { label: 'Energy Source', value: user?.profile?.energySource || 'Mixed Grid' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-surface-700 last:border-0">
                      <span className="text-gray-400 text-sm">{item.label}</span>
                      <span className="text-white font-medium text-sm capitalize">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-white mb-6">Activity Stats</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Total Activities Logged', value: '42' },
                    { label: 'Longest Streak', value: '14 Days' },
                    { label: 'Challenges Completed', value: '4' },
                    { label: 'Average Daily CO₂', value: '9.8 kg' },
                    { label: 'Top Category', value: 'Transport (42%)' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-surface-700 last:border-0">
                      <span className="text-gray-400 text-sm">{item.label}</span>
                      <span className="text-white font-medium text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'Badges' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {MOCK_BADGES.map(badge => (
                <Card key={badge.id} hover className={`text-center transition-all ${badge.earned ? 'bg-surface-800' : 'bg-surface-900/50 opacity-60'}`}>
                  <div className="text-5xl mb-4 grayscale-0">{badge.icon}</div>
                  <h4 className="font-bold text-white text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{badge.desc}</p>
                  <Badge variant={
                    badge.rarity === 'common' ? 'green' :
                    badge.rarity === 'rare' ? 'amber' :
                    badge.rarity === 'epic' ? 'blue' : 'purple'
                  }>{badge.rarity}</Badge>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="max-w-2xl space-y-6">
              <Card>
                <div className="flex items-center gap-2 mb-6">
                  <Bell className="w-5 h-5 text-eco-400" />
                  <h3 className="font-bold text-white">Notifications</h3>
                </div>
                <div className="space-y-4">
                  {['Weekly Progress Reports', 'Challenge Reminders', 'Achievement Alerts'].map((label, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-eco-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-2 mb-6">
                  <Settings className="w-5 h-5 text-eco-400" />
                  <h3 className="font-bold text-white">Account Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-surface-700">
                    <div>
                      <div className="text-sm text-white font-medium">Theme</div>
                      <div className="text-xs text-gray-400">Choose your interface theme</div>
                    </div>
                    <div className="flex bg-surface-900 rounded-lg p-1">
                      <button className="px-3 py-1 rounded-md text-xs font-medium bg-surface-700 text-white">Dark</button>
                      <button className="px-3 py-1 rounded-md text-xs font-medium text-gray-500">Light</button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">Change Password</Button>
                </div>
              </Card>

              <Card className="border-red-500/20 bg-red-900/5">
                <div className="flex items-center gap-2 mb-4">
                  <Trash2 className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-red-500">Danger Zone</h3>
                </div>
                <p className="text-sm text-red-400/80 mb-4">
                  Once you delete your account, there is no going back. All your logged activities, stats, and achievements will be permanently erased.
                </p>
                <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>Delete Account</Button>
              </Card>

              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </div>
            </div>
          )}

        </div>
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Account" size="sm">
        <p className="text-gray-400 text-sm mb-6">
          Are you absolutely sure? This action cannot be undone. This will permanently delete your account and remove your data from our servers.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button variant="danger">Yes, delete account</Button>
        </div>
      </Modal>

    </div>
  )
}
