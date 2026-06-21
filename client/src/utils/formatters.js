// src/utils/formatters.js

export const formatCO2 = (kg) => {
  if (kg === null || kg === undefined) return '—'
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t CO₂e`
  if (kg >= 1)    return `${kg.toFixed(1)} kg CO₂e`
  return `${(kg * 1000).toFixed(0)} g CO₂e`
}

export const formatCO2Short = (kg) => {
  if (kg === null || kg === undefined) return '—'
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`
  return `${Math.abs(kg).toFixed(1)} kg`
}

export const formatDate = (date, options = {}) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', ...options,
  })
}

export const formatDateShort = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export const formatRelative = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60)     return 'just now'
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return formatDateShort(date)
}

export const formatNumber = (n, dec = 1) => {
  if (n === null || n === undefined) return '—'
  if (n >= 1e6) return `${(n / 1e6).toFixed(dec)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(dec)}K`
  return Number(n).toFixed(dec)
}

export const formatPercent = (n) => {
  if (n === null || n === undefined) return '—'
  return `${n > 0 ? '+' : ''}${n.toFixed(0)}%`
}

export const getImpactLevel = (kgPerActivity) => {
  if (kgPerActivity === 0)   return { label: 'Zero',      color: 'text-gray-400',   bg: 'bg-gray-500/10',   border: 'border-gray-500/20'  }
  if (kgPerActivity < 2)     return { label: 'Very Low',  color: 'text-eco-400',    bg: 'bg-eco-500/10',    border: 'border-eco-500/20'   }
  if (kgPerActivity < 5)     return { label: 'Low',       color: 'text-eco-400',    bg: 'bg-eco-500/10',    border: 'border-eco-500/20'   }
  if (kgPerActivity < 10)    return { label: 'Medium',    color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' }
  if (kgPerActivity < 20)    return { label: 'High',      color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20'}
  return                              { label: 'Very High', color: 'text-red-400',   bg: 'bg-red-500/10',    border: 'border-red-500/20'   }
}

export const co2ToEquivalent = (kg) => {
  if (kg <= 0) return null
  const km = (kg / 0.192).toFixed(0)
  const phones = (kg / 0.005).toFixed(0)
  const trees = (kg / 21).toFixed(2)
  return { km, phones, trees }
}
