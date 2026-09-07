import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '../api/client'
import { AppShell } from '../components/AppShell'
import { StatusBadge } from '../components/StatusBadge'
import type { VisitHistoryRow } from '../types'
import { VISIT_REASON_LABELS } from '../types'

const POLL_INTERVAL_MS = 5000

export function SecurityDashboard() {
  const [visits, setVisits] = useState<VisitHistoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [actingOn, setActingOn] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const { data } = await apiClient.get<VisitHistoryRow[]>('/api/security/visits/active')
    setVisits(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const id = window.setInterval(refresh, POLL_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [refresh])

  async function start(id: string) {
    setActingOn(id)
    try {
      await apiClient.post(`/api/security/visits/${id}/start`)
      await refresh()
    } finally {
      setActingOn(null)
    }
  }

  async function closeVisit(id: string) {
    setActingOn(id)
    try {
      await apiClient.post(`/api/security/visits/${id}/close`)
      await refresh()
    } finally {
      setActingOn(null)
    }
  }

  return (
    <AppShell title="Sécurité" links={[{ to: '/security', label: 'Visiteurs présents' }]}>
      <h2 className="section-title">Visiteurs actuellement présents</h2>
      <p className="section-subtitle">Clôturez la visite dès que le visiteur quitte les locaux.</p>

      {loading && (
        <div className="card" style={{ padding: 20 }}>
          <div className="skeleton" style={{ height: 20, width: '50%' }} />
        </div>
      )}

      {!loading && visits.length === 0 && (
        <div className="card empty-state">
          <div className="icon">🛎️</div>
          <div className="title">Aucun visiteur présent</div>
          <p style={{ margin: 0 }}>Les visites validées par le secrétariat apparaîtront ici.</p>
        </div>
      )}

      {!loading && visits.length > 0 && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Visiteur</th>
                <th>Reçu par</th>
                <th>Motif</th>
                <th>Statut</th>
                <th>Localisation</th>
                <th>Arrivée</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => (
                <tr key={v.id}>
                  <td>{v.visitorFullName}</td>
                  <td>{v.employeeFullName}</td>
                  <td>{VISIT_REASON_LABELS[v.reason]}</td>
                  <td>
                    <StatusBadge status={v.status} />
                  </td>
                  <td>{v.locationSnapshot || '—'}</td>
                  <td>{new Date(v.arrivalTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      {v.status === 'ACCEPTEE' && (
                        <button className="btn btn-secondary" disabled={actingOn === v.id} onClick={() => start(v.id)}>
                          Démarrer
                        </button>
                      )}
                      <button className="btn btn-primary" disabled={actingOn === v.id} onClick={() => closeVisit(v.id)}>
                        Clôturer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  )
}
