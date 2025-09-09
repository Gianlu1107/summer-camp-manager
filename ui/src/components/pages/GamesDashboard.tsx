import { Award, Medal, PlusCircle, Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'

type Team = { name: string; color: 'rosso'|'blu'|'verde'|'giallo'; score: number; wins: number; lastGame?: string }

export default function GamesDashboard() {
  const [teams, setTeams] = useState<Team[]>([
    { name: 'Rosso', color: 'rosso', score: 42, wins: 3, lastGame: 'Corsa' },
    { name: 'Blu', color: 'blu', score: 48, wins: 4, lastGame: 'Rope' },
    { name: 'Verde', color: 'verde', score: 37, wins: 2, lastGame: 'Palla' },
    { name: 'Giallo', color: 'giallo', score: 30, wins: 1, lastGame: 'Staffetta' },
  ])

  const leaderboard = useMemo(() => [...teams].sort((a,b)=> b.score - a.score), [teams])

  return (
    <div className="min-h-dvh p-6 md:p-10">
      <header className="liquid-glass mb-6 px-4 py-3 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-amber-500" />
          <h2 className="text-lg md:text-xl font-semibold">Dashboard Giochi</h2>
        </div>
        <button className="neon-button">
          <PlusCircle className="h-4 w-4 mr-2" /> Nuovo punteggio
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="liquid-glass p-4 rounded-2xl lg:col-span-2">
          <h3 className="font-semibold mb-3">Punteggi squadre</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600">
                  <th className="py-2">Squadra</th>
                  <th>Punteggio</th>
                  <th>Giochi vinti</th>
                  <th>Ultimo gioco</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(t => (
                  <tr key={t.name} className="border-t border-white/30">
                    <td className="py-2">
                      <span className={`badge ${t.color === 'rosso' ? 'team-rosso' : t.color === 'blu' ? 'team-blu' : t.color === 'verde' ? 'team-verde' : 'team-giallo'}`}>{t.name}</span>
                    </td>
                    <td>{t.score}</td>
                    <td>{t.wins}</td>
                    <td>{t.lastGame}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="liquid-glass p-4 rounded-2xl">
          <h3 className="font-semibold mb-3 inline-flex items-center gap-2"><Award className="h-4 w-4 text-amber-500" /> Classifica</h3>
          <ol className="space-y-2">
            {leaderboard.map((t, i) => (
              <li key={t.name} className={`flex items-center justify-between p-3 rounded-xl ${i===0 ? 'glow' : ''}`}>
                <div className="flex items-center gap-3">
                  {i===0 ? <Trophy className="h-5 w-5 text-amber-500" /> : <Medal className="h-5 w-5 text-slate-500" />}
                  <span>{i+1}. {t.name}</span>
                </div>
                <strong>{t.score}</strong>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}


