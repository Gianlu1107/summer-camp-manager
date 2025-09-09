import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../components/pages/LoginPage'
import AdminDashboard from '../components/pages/AdminDashboard'
import WelcomeDashboard from '../components/pages/WelcomeDashboard'
import GamesDashboard from '../components/pages/GamesDashboard'

type UserRole = 'admin' | 'rosso' | 'blu' | 'verde' | 'giallo' | 'staff'

type AuthUser = {
  username: string
  role: UserRole
}

function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('scm_user')
    if (raw) {
      try { setUser(JSON.parse(raw)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = (username: string, password: string) => {
    // Demo credentials mapping
    const map: Record<string, AuthUser> = {
      admin: { username: 'admin', role: 'admin' },
      staff: { username: 'staff', role: 'rosso' },
      blu: { username: 'blu', role: 'blu' },
    }
    if (map[username] && password === username) {
      localStorage.setItem('scm_user', JSON.stringify(map[username]))
      setUser(map[username])
      return { ok: true, user: map[username] }
    }
    return { ok: false as const }
  }

  const logout = () => {
    localStorage.removeItem('scm_user')
    setUser(null)
  }

  return { user, loading, login, logout }
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuthContext()
  if (loading) return <div className="centered-container"><div className="liquid-card">Loading…</div></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

type AuthContextType = ReturnType<typeof useAuth>
import { createContext, useContext } from 'react'
const AuthContext = createContext<AuthContextType | null>(null)
function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('AuthContext missing')
  return ctx
}

export default function CampRouter() {
  const auth = useAuth()

  const home = useMemo(() => {
    if (!auth.user) return '/login'
    if (auth.user.role === 'admin') return '/admin'
    return '/welcome'
  }, [auth.user])

  return (
    <AuthContext.Provider value={auth}>
      <BrowserRouter>
        <div className="liquid-background" />
        <Routes>
          <Route path="/" element={<Navigate to={home} replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/welcome" element={<ProtectedRoute><WelcomeDashboard /></ProtectedRoute>} />
          <Route path="/games" element={<ProtectedRoute><GamesDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={home} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export { useAuthContext }


