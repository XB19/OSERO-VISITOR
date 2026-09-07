import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '../api/client'
import { AppShell } from '../components/AppShell'
import { SECRETARIAT_LINKS } from './links'
import type { VisitRequestView } from '../types'
import { VISIT_REASON_LABELS } from '../types'

const POLL_INTERVAL_MS = 5000

export function SecretariatDashboard() {
  const [visits, setVisits] = useState<VisitRequestView[]>([])
  const [loading, setLoading] = useState(true)
  const [actingOn, setActingOn] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const { data } = await apiClient.get<VisitRequestView[]>('/api/secretariat/visits')
    setVisits(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const id = window.setInterval(refresh, POLL_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [refresh])

  async function act(visitId: string, action: 'accept' | 'wait' | 'refuse') {
    setActingOn(visitId)
    try {
      await apiClient.post(`/api/secretariat/visits/${visitId}/${action}`)
      await refresh()
    } finally {
      setActingOn(null)
    }
  }

  return (
    <AppShell title="Secrétariat" links={SECRETARIAT_LINKS}>
      <h2 className="section-title">Demandes de visite à valider</h2>
      <p className="section-subtitle">
        Chaque demande validée ou clôturée est automatiquement enregistrée dans le registre numérique.
      </p>

      {loading && (
        <div className="card" style={{ padding: 20, marginBottom: 14 }}>
          <div className="skeleton" style={{ height: 20, width: '40%', marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 14, width: '65%' }} />
        </div>
      )}

      {!loading && visits.length === 0 && (
        <div className="card empty-state">
          <div className="icon">📭</div>
          <div className="title">Aucune demande en attente</div>
          <p style={{ margin: 0 }}>Les nouvelles demandes envoyées depuis la borne apparaîtront ici automatiquement.</p>
        </div>
      )}

      {visits.map((v) => (
        <div key={v.id} className="card request-card fade-in">
          <div className="info">
            <div className="name">{v.visitorFullName}</div>
            <div className="meta">
              Motif : {VISIT_REASON_LABELS[v.reason]}
              {v.reasonDetail ? ` — ${v.reasonDetail}` : ''} · Arrivé à{' '}
              {new Date(v.arrivalTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              {v.overdue && (
                <span className="badge badge-warning" style={{ marginLeft: 8 }}>
                  <span className="badge-dot" />
                  En attente prolongée
                </span>
              )}
            </div>
            <div className="meta">
              Pour : <strong>{v.employeeFullName}</strong>
              {v.employeeJobTitle ? ` — ${v.employeeJobTitle}` : ''}
              {v.employeePhone ? ` · ${v.employeePhone}` : ''}
            </div>
          </div>
          <div className="actions">
            <button
              className="btn btn-success"
              disabled={actingOn === v.id}
              onClick={() => act(v.id, 'accept')}
            >
              Valider
            </button>
            <button
              className="btn btn-secondary"
              disabled={actingOn === v.id}
              onClick={() => act(v.id, 'wait')}
            >
              Faire patienter
            </button>
            <button
              className="btn btn-danger"
              disabled={actingOn === v.id}
              onClick={() => act(v.id, 'refuse')}
            >
              Refuser
            </button>
          </div>
        </div>
      ))}
    </AppShell>
  )
}
