import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'
import { StatusBadge } from './StatusBadge'
import { downloadVisitRegisterPdf } from '../utils/registerPdf'
import type { VisitHistoryRow } from '../types'
import { VISIT_REASON_LABELS } from '../types'

function formatDuration(seconds: number | null) {
  if (seconds == null) return '—'
  return `${Math.round(seconds / 60)} min`
}

/** Registre des visites (historique), partage entre l'espace secretariat et l'espace admin. */
export function VisitHistoryView({ apiUrl }: { apiUrl: string }) {
  const [rows, setRows] = useState<VisitHistoryRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<VisitHistoryRow[]>(apiUrl).then((res) => {
      setRows(res.data)
      setLoading(false)
    })
  }, [apiUrl])

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 className="section-title">Registre numérique des visites</h2>
          <p className="section-subtitle">
            Historique des 30 derniers jours — remplace le registre papier, chaque visite validée y figure automatiquement.
          </p>
        </div>
        <button
          className="btn btn-primary"
          disabled={loading || rows.length === 0}
          onClick={() => downloadVisitRegisterPdf(rows)}
        >
          ⬇ Télécharger le registre (PDF)
        </button>
      </div>

      {loading && (
        <div className="card" style={{ padding: 20 }}>
          <div className="skeleton" style={{ height: 20, width: '50%' }} />
        </div>
      )}

      {!loading && rows.length === 0 && (
        <div className="card empty-state">
          <div className="icon">🗒️</div>
          <div className="title">Aucune visite enregistrée</div>
          <p style={{ margin: 0 }}>Les visites traitées apparaîtront ici, classées par ordre chronologique.</p>
        </div>
      )}

      {!loading && rows.length > 0 && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Visiteur</th>
                <th>Reçu par</th>
                <th>Motif</th>
                <th>Statut</th>
                <th>Arrivée</th>
                <th>Attente</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.visitorFullName}</td>
                  <td>{r.employeeFullName}</td>
                  <td>{VISIT_REASON_LABELS[r.reason]}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td>{new Date(r.arrivalTime).toLocaleString('fr-FR')}</td>
                  <td>{formatDuration(r.waitSeconds)}</td>
                  <td>{formatDuration(r.durationSeconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
