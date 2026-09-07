import { useState } from 'react'
import type { VisitReason } from '../../types'
import { VISIT_REASON_LABELS } from '../../types'

const REASONS: VisitReason[] = [
  'RENDEZ_VOUS',
  'REUNION',
  'PARTENAIRE',
  'LIVRAISON',
  'RECRUTEMENT',
  'DEPOT_DOCUMENT',
  'AUTRE',
]

export function ReasonStep({
  reason,
  reasonDetail,
  onBack,
  onNext,
}: {
  reason: VisitReason | null
  reasonDetail: string
  onBack: () => void
  onNext: (reason: VisitReason, reasonDetail: string) => void
}) {
  const [selected, setSelected] = useState<VisitReason | null>(reason)
  const [detail, setDetail] = useState(reasonDetail)

  return (
    <div className="kiosk-panel">
      <h1 className="kiosk-title">Motif de votre visite</h1>
      <p className="kiosk-subtitle">Sélectionnez la raison de votre venue</p>

      <div className="kiosk-grid">
        {REASONS.map((r) => (
          <button
            key={r}
            className={`kiosk-option ${selected === r ? 'selected' : ''}`}
            onClick={() => setSelected(r)}
          >
            {VISIT_REASON_LABELS[r]}
          </button>
        ))}
      </div>

      {selected === 'AUTRE' && (
        <div className="kiosk-field">
          <label htmlFor="detail">Précisez</label>
          <input
            id="detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Précisez le motif de votre visite"
          />
        </div>
      )}

      <div className="kiosk-nav">
        <button className="btn btn-secondary" onClick={onBack}>
          Retour
        </button>
        <button
          className="btn btn-primary"
          disabled={!selected}
          onClick={() => selected && onNext(selected, detail.trim())}
        >
          Continuer
        </button>
      </div>
    </div>
  )
}
