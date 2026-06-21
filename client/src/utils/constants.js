// src/utils/constants.js
export const EMISSION_FACTORS = {
  transport: {
    car_gasoline:    { label: 'Car (Gasoline)',      unit: 'km',    factor: 0.192  },
    car_diesel:      { label: 'Car (Diesel)',         unit: 'km',    factor: 0.171  },
    car_ev:          { label: 'Car (Electric)',       unit: 'km',    factor: 0.053  },
    car_hybrid:      { label: 'Car (Hybrid)',         unit: 'km',    factor: 0.111  },
    motorcycle:      { label: 'Motorcycle',           unit: 'km',    factor: 0.114  },
    bus:             { label: 'Bus',                  unit: 'km',    factor: 0.089  },
    train:           { label: 'Train',                unit: 'km',    factor: 0.041  },
    subway:          { label: 'Subway / Metro',       unit: 'km',    factor: 0.028  },
    flight_short:    { label: 'Short-haul Flight',   unit: 'km',    factor: 0.255  },
    flight_long:     { label: 'Long-haul Flight',    unit: 'km',    factor: 0.195  },
    cycling:         { label: 'Cycling',              unit: 'km',    factor: 0.0    },
    walking:         { label: 'Walking',              unit: 'km',    factor: 0.0    },
  },
  food: {
    beef:        { label: 'Beef',              unit: 'kg',    factor: 27.0   },
    lamb:        { label: 'Lamb',              unit: 'kg',    factor: 39.2   },
    pork:        { label: 'Pork',              unit: 'kg',    factor: 12.1   },
    chicken:     { label: 'Chicken',           unit: 'kg',    factor: 6.9    },
    fish:        { label: 'Fish (avg)',         unit: 'kg',    factor: 6.1    },
    dairy:       { label: 'Dairy Milk',        unit: 'litre', factor: 3.2    },
    cheese:      { label: 'Cheese',            unit: 'kg',    factor: 13.5   },
    eggs:        { label: 'Eggs',              unit: 'dozen', factor: 3.6    },
    vegetables:  { label: 'Vegetables',        unit: 'kg',    factor: 2.0    },
    fruits:      { label: 'Fruits',            unit: 'kg',    factor: 1.1    },
    grains:      { label: 'Grains / Cereals',  unit: 'kg',    factor: 1.4    },
    coffee:      { label: 'Coffee',            unit: 'kg',    factor: 28.5   },
    chocolate:   { label: 'Chocolate',         unit: 'kg',    factor: 18.7   },
    tofu:        { label: 'Tofu',              unit: 'kg',    factor: 3.0    },
  },
  energy: {
    electricity_coal:  { label: 'Electricity (Coal Grid)',    unit: 'kWh',   factor: 0.82  },
    electricity_mix:   { label: 'Electricity (Mixed Grid)',   unit: 'kWh',   factor: 0.43  },
    electricity_renew: { label: 'Electricity (Renewables)',   unit: 'kWh',   factor: 0.05  },
    natural_gas:       { label: 'Natural Gas',                unit: 'm³',    factor: 2.04  },
    heating_oil:       { label: 'Heating Oil',                unit: 'litre', factor: 2.96  },
    lpg:               { label: 'LPG / Propane',              unit: 'kg',    factor: 2.98  },
    wood:              { label: 'Firewood',                   unit: 'kg',    factor: 0.39  },
  },
  shopping: {
    clothing:      { label: 'Clothing (new item)',   unit: 'item', factor: 10.0  },
    electronics:   { label: 'Electronics',           unit: 'item', factor: 70.0  },
    furniture:     { label: 'Furniture',             unit: 'item', factor: 45.0  },
    books:         { label: 'Books',                 unit: 'item', factor: 2.5   },
    online_order:  { label: 'Online Order (pkg)',    unit: 'pkg',  factor: 0.5   },
  },
  waste: {
    landfill:  { label: 'Landfill Waste',   unit: 'kg', factor: 0.58  },
    recycled:  { label: 'Recycled Waste',   unit: 'kg', factor: 0.02  },
    composted: { label: 'Composted Waste',  unit: 'kg', factor: 0.01  },
  },
}

export const CATEGORY_META = {
  transport: { label: 'Transport',  emoji: '🚗', color: '#38bdf8', tw: 'sky-400'     },
  food:      { label: 'Food',       emoji: '🍽️', color: '#4ade80', tw: 'eco-400'     },
  energy:    { label: 'Energy',     emoji: '⚡',  color: '#fbbf24', tw: 'amber-400'   },
  shopping:  { label: 'Shopping',   emoji: '🛍️', color: '#a78bfa', tw: 'violet-400'  },
  waste:     { label: 'Waste',      emoji: '♻️',  color: '#f87171', tw: 'red-400'     },
}

export const CATEGORY_COLORS = {
  transport: '#38bdf8',
  food:      '#4ade80',
  energy:    '#fbbf24',
  shopping:  '#a78bfa',
  waste:     '#f87171',
}

export const CATEGORY_ICONS = {
  transport: '🚗',
  food:      '🍽️',
  energy:    '⚡',
  shopping:  '🛍️',
  waste:     '♻️',
}

export const GLOBAL_AVG_KG_DAY  = 4000 / 365   // ~10.96

export const LEVELS = [
  { level: 1,  name: 'Seedling',   minXP: 0,      color: '#94a3b8', emoji: '🌱' },
  { level: 2,  name: 'Sapling',    minXP: 200,    color: '#4ade80', emoji: '🌿' },
  { level: 3,  name: 'Sprout',     minXP: 500,    color: '#22c55e', emoji: '🌾' },
  { level: 4,  name: 'Leafy',      minXP: 1000,   color: '#a3e635', emoji: '🍃' },
  { level: 5,  name: 'Canopy',     minXP: 2000,   color: '#fbbf24', emoji: '🌳' },
  { level: 6,  name: 'Forest',     minXP: 4000,   color: '#fb923c', emoji: '🌲' },
  { level: 7,  name: 'Rainforest', minXP: 8000,   color: '#38bdf8', emoji: '🌴' },
  { level: 8,  name: 'Ecosystem',  minXP: 15000,  color: '#a78bfa', emoji: '🌍' },
  { level: 9,  name: 'Biosphere',  minXP: 30000,  color: '#f0abfc', emoji: '🪐' },
  { level: 10, name: 'Guardian',   minXP: 60000,  color: '#fde68a', emoji: '⭐' },
]

export const MOCK_CHALLENGES = [
  { id: '1', title: 'No-Car Week',         desc: 'Use only public transport for 7 days',        category: 'transport', difficulty: 'medium', duration: 7,  xpReward: 150, participants: 1247, icon: '🚌', joined: true,  progress: 60  },
  { id: '2', title: 'Plant-Based Week',    desc: 'Eat vegan for 7 days straight',                category: 'food',      difficulty: 'easy',   duration: 7,  xpReward: 100, participants: 3821, icon: '🥗', joined: true,  progress: 35  },
  { id: '3', title: 'Zero Waste Day',      desc: 'Produce no landfill waste for a day',          category: 'waste',     difficulty: 'hard',   duration: 1,  xpReward: 75,  participants: 892,  icon: '♻️', joined: false, progress: 0   },
  { id: '4', title: 'Lights Out 30min',    desc: 'Join Earth Hour — no electricity for 30min',   category: 'energy',    difficulty: 'easy',   duration: 1,  xpReward: 50,  participants: 5630, icon: '💡', joined: false, progress: 0   },
  { id: '5', title: 'Local Produce Month', desc: 'Buy only locally sourced food for 30 days',    category: 'food',      difficulty: 'hard',   duration: 30, xpReward: 300, participants: 456,  icon: '🌽', joined: false, progress: 0   },
  { id: '6', title: 'Cycle to Work',       desc: 'Bike to work every day this week',             category: 'transport', difficulty: 'medium', duration: 5,  xpReward: 125, participants: 2109, icon: '🚲', joined: false, progress: 0   },
  { id: '7', title: 'Cold Shower Week',    desc: 'Cold showers save energy for 7 days',          category: 'energy',    difficulty: 'medium', duration: 7,  xpReward: 100, participants: 1567, icon: '🚿', joined: false, progress: 0   },
  { id: '8', title: 'Digital Detox Day',   desc: 'Unplug all devices to reduce energy use',      category: 'energy',    difficulty: 'easy',   duration: 1,  xpReward: 60,  participants: 789,  icon: '📵', joined: false, progress: 0   },
]
