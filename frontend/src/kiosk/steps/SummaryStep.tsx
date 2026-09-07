import { useState } from 'react'
import type { VisitDraft } from '../types'
import { VISIT_REASON_LABELS } from '../../types'

export function SummaryStep({
  draft,
  onBack,
  onConfirm,
}: {
  draft: VisitDraft
  onBack: () => void
  onConfirm: () => Promise<void>
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setSubmitting(true)
    setError(null)
    try {
      await onConfirm()
    } catch {
      setError("Une erreur est survenue. Merci de vous rapprocher de l'accueil.")
      setSubmitting(false)
    }
  }

  return (
    <div className="kiosk-panel">
      <h1 className="kiosk-title">Récapitulatif</h1>
      <p className="kiosk-subtitle">Vérifiez vos informations avant l'envoi</p>

      <div className="kiosk-summary">
        <div className="kiosk-summary-row">
          <span className="label">Visiteur</span>
          <span className="value">
            {draft.firstName} {draft.lastName}
          </span>
        </div>
        <div className="kiosk-summary-row">
          <span className="label">Motif</span>
          <span className="value">{draft.reason ? VISIT_REASON_LABELS[draft.reason] : ''}</span>
        </div>
        {draft.reasonDetail && (
          <div className="kiosk-summary-row">
            <span className="label">Précision</span>
            <span className="value">{draft.reasonDetail}</span>
          </div>
        )}
        <div className="kiosk-summary-row">
          <span className="label">Personne à rencontrer</span>
          <span className="value">{draft.employee?.fullName}</span>
        </div>
      </div>

      {error && <p className="kiosk-error">{error}</p>}

      <div className="kiosk-nav" style={{ marginTop: 24 }}>
        <button className="btn btn-secondary" onClick={onBack} disabled={submitting}>
          Retour
        </button>
        <button className="btn btn-primary" onClick={handleConfirm} disabled={submitting}>
          {submitting ? 'Envoi...' : 'Envoyer la demande'}
        </button>
      </div>
    </div>
  )
}
