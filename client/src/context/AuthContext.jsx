// src/context/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  token: localStorage.getItem('eg_token'),
  isLoading: true,
  isAuthenticated: false,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('eg_token', action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGOUT':
      localStorage.removeItem('eg_token')
      return { ...state, user: null, token: null, isAuthenticated: false, isLoading: false }
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const token = localStorage.getItem('eg_token')
    if (token) {
      api.get('/auth/me')
        .then(res => dispatch({ type: 'SET_USER', payload: res.data.data }))
        .catch(() => dispatch({ type: 'LOGOUT' }))
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials)
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.data })
    return res.data.data
  }

  const register = async (data) => {
    const res = await api.post('/auth/register', data)
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.data })
    return res.data.data
  }

  const logout = () => dispatch({ type: 'LOGOUT' })
  const updateUser = (data) => dispatch({ type: 'UPDATE_USER', payload: data })

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
