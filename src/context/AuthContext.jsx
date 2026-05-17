import { createContext, useContext, useEffect, useState } from 'react'
import { getData, saveData } from '../utils/storage.js'

const AuthContext = createContext(null)
const SESSION_KEY = 'medicare:session'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) setUser(JSON.parse(raw))
    setReady(true)
  }, [])

  const startSession = (record) => {
    const session = {
      id: record.id,
      name: record.name,
      email: record.email,
      role: record.role || 'patient',
      phone: record.phone || ''
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return session
  }

  const login = (email, password) => {
    const users = getData('users', [])
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!found) return { ok: false, error: 'Invalid email or password' }
    return { ok: true, user: startSession(found) }
  }

  const register = ({ name, email, phone, password }) => {
    const users = getData('users', [])
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists' }
    }
    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      password,
      role: 'patient',
      createdAt: new Date().toISOString()
    }
    users.push(newUser)
    saveData('users', users)
    return { ok: true, user: startSession(newUser) }
  }

  const updateProfile = (patch) => {
    if (!user) return { ok: false }
    const users = getData('users', [])
    const next = users.map((u) => (u.id === user.id ? { ...u, ...patch } : u))
    saveData('users', next)
    const updated = next.find((u) => u.id === user.id)
    startSession(updated)
    return { ok: true }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'
  const isPatient = user?.role === 'patient'

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout, ready, isAdmin, isPatient }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
