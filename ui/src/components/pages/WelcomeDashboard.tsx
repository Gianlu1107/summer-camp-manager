import { Check, Clock, Save } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAuthContext } from '../../components/CampRouter'

type Kid = { id: string; name: string; lunch: boolean; present: boolean; note?: string }

export default function WelcomeDashboard() {
  const { user } = useAuthContext()
  const [kids, setKids] = useState<Kid[]>([
    { id: '1', name: 'Luca Bianchi', present: false, lunch: false },
    { id: '2', name: 'Sara Verdi', present: true, lunch: true },
    { id: '3', name: 'Marco Rossi', present: false, lunch: true },
  ])
  const [now, setNow] = useState<string>(new Date().toLocaleTimeString())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(t)
  }, [])

  const stats = useMemo(() => {
    const total = kids.length
    const present = kids.filter(k => k.present).length
    const lunches = kids.filter(k => k.lunch).length
    return { total, present, lunches }
  }, [kids])

  const teamClass = useMemo(() => {
    switch (user?.role) {
      case 'rosso': return 'team-rosso'
      case 'blu': return 'team-blu'
      case 'verde': return 'team-verde'
      case 'giallo': return 'team-giallo'
      default: return 'team-blu'
    }
  }, [user])

  return (
    <div className="min-h-dvh p-6 md:p-10">
      <header className={`mb-6 px-4 py-3 rounded-2xl flex items-center justify-between ${teamClass}`}>
        <h2 className="text-lg md:text-xl font-semibold">Accoglienza - Squadra {user?.role ?? 'blu'}</h2>
        <div className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> {now}</div>
      </header>

      <section className="liquid-glass p-4 rounded-2xl">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div className="badge"><span>Presenti</span> <strong>{stats.present}/{stats.total}</strong></div>
          <div className="badge"><span>Pranzi</span> <strong>{stats.lunches}</strong></div>
          <div className="badge"><span>Ora</span> <strong>{now}</strong></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2">Nome</th>
                <th>Presenza</th>
                <th>Pranzo</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {kids.map(k => (
                <tr key={k.id} className="border-t border-white/30">
                  <td className="py-2">{k.name}</td>
                  <td className="text-center">
                    <input type="checkbox" className="form-checkbox h-5 w-5 rounded glow" checked={k.present} onChange={e => setKids(prev => prev.map(x => x.id === k.id ? { ...x, present: e.target.checked } : x))} />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" className="form-checkbox h-5 w-5 rounded glow" checked={k.lunch} onChange={e => setKids(prev => prev.map(x => x.id === k.id ? { ...x, lunch: e.target.checked } : x))} />
                  </td>
                  <td>
                    <input className="form-input w-full rounded-lg" value={k.note ?? ''} onChange={e => setKids(prev => prev.map(x => x.id === k.id ? { ...x, note: e.target.value } : x))} placeholder="Note" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button className="neon-button">
            <Save className="h-4 w-4 mr-2" /> Salva
          </button>
        </div>
      </section>
    </div>
  )
}


