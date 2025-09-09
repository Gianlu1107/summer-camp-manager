import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../components/CampRouter'
import { KeyRound, User } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuthContext()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = login(username.trim(), password.trim())
    if (res.ok) {
      navigate('/')
    } else {
      setError('Credenziali non valide')
      setLoading(false)
    }
  }

  return (
    <div className="centered-container">
      <div className="liquid-card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Summer Camp Manager</h1>
          <span className="badge">Liquid Glass Design</span>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <div className="relative">
              <input
                className="form-input w-full rounded-xl pl-10"
                placeholder="admin / staff / blu"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                className="form-input w-full rounded-xl pl-10"
                placeholder="uguale all'username"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
            </div>
          </div>

          {error && (
            <div className="badge errorShake">
              <span className="text-danger-600">{error}</span>
            </div>
          )}

          <button className="neon-button w-full" disabled={loading}>
            {loading ? 'Accesso…' : 'Accedi'}
          </button>
        </form>

        <div className="mt-6 text-xs text-slate-600">
          <div>Credenziali demo:</div>
          <div>Admin: admin / admin</div>
          <div>Staff Rosso: staff / staff</div>
          <div>Staff Blu: blu / blu</div>
        </div>
      </div>
    </div>
  )
}


