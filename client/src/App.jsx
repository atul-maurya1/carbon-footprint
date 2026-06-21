// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// ── Pages (lazy loaded) ──────────────────────────────────────────
const HomePage        = lazy(() => import('./pages/HomePage'))
const LoginPage       = lazy(() => import('./pages/LoginPage'))
const RegisterPage    = lazy(() => import('./pages/RegisterPage'))
const DashboardPage   = lazy(() => import('./pages/DashboardPage'))
const CalculatorPage  = lazy(() => import('./pages/CalculatorPage'))
const LogPage         = lazy(() => import('./pages/LogPage'))
const CoachPage       = lazy(() => import('./pages/CoachPage'))
const InsightsPage    = lazy(() => import('./pages/InsightsPage'))
const ChallengesPage  = lazy(() => import('./pages/ChallengesPage'))
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'))
const ProfilePage     = lazy(() => import('./pages/ProfilePage'))
const OnboardingPage  = lazy(() => import('./pages/OnboardingPage'))
const NotFoundPage    = lazy(() => import('./pages/NotFoundPage'))

// ── Loader ───────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-eco-800 border-t-eco-400 animate-spin" />
        <p className="text-gray-500 text-sm">Loading EcoGuide AI...</p>
      </div>
    </div>
  )
}

// ── Route Guards ─────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  // Redirect to onboarding if not completed (except if already on onboarding page)
  if (user && user.onboardingComplete === false) return <Navigate to="/onboarding" replace />
  return children
}

function OnboardingRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <PageLoader />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

// ── Router ───────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<HomePage />} />
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Onboarding (protected but no onboarding redirect) */}
          <Route path="/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />

          {/* Protected */}
          <Route path="/dashboard"   element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/calculator"  element={<ProtectedRoute><CalculatorPage /></ProtectedRoute>} />
          <Route path="/log"         element={<ProtectedRoute><LogPage /></ProtectedRoute>} />
          <Route path="/ai-coach"    element={<ProtectedRoute><CoachPage /></ProtectedRoute>} />
          <Route path="/insights"    element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
          <Route path="/challenges"  element={<ProtectedRoute><ChallengesPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/profile"     element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

// ── Root ─────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-surface-800 !text-gray-100 !border !border-eco-900/40 !rounded-xl !text-sm !shadow-xl',
          success: { iconTheme: { primary: '#4ade80', secondary: '#030712' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#030712' } },
          duration: 3500,
        }}
      />
    </AuthProvider>
  )
}
