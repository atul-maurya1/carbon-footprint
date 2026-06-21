import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-950 p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-eco-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center animate-fade-up">
        <div className="w-24 h-24 rounded-3xl bg-eco-500/10 flex items-center justify-center border border-eco-500/20 mb-8">
          <Leaf className="w-12 h-12 text-eco-400" />
        </div>
        
        <h1 className="text-7xl font-display font-black text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page not found</h2>
        <p className="text-gray-400 max-w-md mb-8">
          Oops! It looks like you've wandered off the eco-friendly path. 
          Let's get you back to tracking your carbon footprint.
        </p>
        
        <Link to="/">
          <Button icon={ArrowLeft}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
