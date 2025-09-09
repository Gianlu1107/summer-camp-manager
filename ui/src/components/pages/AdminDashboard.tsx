import { LogOut, Settings, Shield, Users } from 'lucide-react'
import { useAuthContext } from '../../components/CampRouter'
import { useState } from 'react'

type TabKey = 'overview' | 'users' | 'teams' | 'kids'

export default function AdminDashboard() {
  const { logout } = useAuthContext()
  const [tab, setTab] = useState<TabKey>('overview')

  return (
    <div className="min-h-dvh p-6 md:p-10">
      <header className="liquid-glass mb-6 px-4 py-3 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-sky-600" />
          <h2 className="text-lg md:text-xl font-semibold">Dashboard Admin</h2>
        </div>
        <button className="neon-button" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </button>
      </header>

      <nav className="liquid-glass mb-6 p-2 rounded-2xl flex gap-2">
        {[
          { key: 'overview', label: 'Panoramica', icon: Settings },
          { key: 'users', label: 'Utenti/Staff', icon: Users },
          { key: 'teams', label: 'Squadre', icon: Shield },
          { key: 'kids', label: 'Bambini', icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as TabKey)}
            className={`px-4 py-2 rounded-xl ${tab === key ? 'liquid-glass-strong' : ''}`}
          >
            <span className="inline-flex items-center gap-2"><Icon className="h-4 w-4" /> {label}</span>
          </button>
        ))}
      </nav>

      <main className="grid md:grid-cols-2 gap-6">
        <section className="liquid-glass p-4 rounded-2xl min-h-40">
          <h3 className="font-semibold mb-3">{tab === 'overview' ? 'Panoramica' : tab === 'users' ? 'Gestione utenti' : tab === 'teams' ? 'Gestione squadre' : 'Gestione bambini'}</h3>
          <p className="text-sm text-slate-600">UI dimostrativa con card traslucide e tab.</p>
        </section>
        <section className="liquid-glass p-4 rounded-2xl min-h-40">
          <h3 className="font-semibold mb-3">Dettagli</h3>
          <p className="text-sm text-slate-600">Modali e CRUD possono essere aggiunti qui.</p>
        </section>
      </main>
    </div>
  )
}


