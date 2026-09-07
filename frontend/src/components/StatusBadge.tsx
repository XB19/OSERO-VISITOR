import type { VisitStatus } from '../types'
import { VISIT_STATUS_LABELS } from '../types'

const STATUS_STYLES: Record<VisitStatus, string> = {
  NOUVELLE_DEMANDE: 'badge-info',
  NOTIFICATION_ENVOYEE: 'badge-info',
  EN_ATTENTE: 'badge-warning',
  ACCEPTEE: 'badge-success',
  EN_COURS: 'badge-success',
  REFUSEE: 'badge-danger',
  TERMINEE: 'badge-neutral',
  ANNULEE: 'badge-neutral',
}

export function StatusBadge({ status }: { status: VisitStatus }) {
  return (
    <span className={`badge ${STATUS_STYLES[status]}`}>
      <span className="badge-dot" />
      {VISIT_STATUS_LABELS[status]}
    </span>
  )
}
