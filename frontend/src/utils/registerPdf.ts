import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { VisitHistoryRow } from '../types'
import { VISIT_REASON_LABELS, VISIT_STATUS_LABELS } from '../types'

function formatDuration(seconds: number | null): string {
  if (seconds == null) return '—'
  return `${Math.round(seconds / 60)} min`
}

/** Genere et telecharge le registre des visites au format PDF. */
export function downloadVisitRegisterPdf(rows: VisitHistoryRow[]) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const generatedAt = new Date()

  doc.setFillColor(20, 82, 143)
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 64, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('OSERO VISITOR — Registre des visites', 32, 32)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(
    `Généré le ${generatedAt.toLocaleDateString('fr-FR')} à ${generatedAt.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })} · ${rows.length} visite(s)`,
    32,
    48,
  )

  autoTable(doc, {
    startY: 84,
    head: [['Visiteur', 'Reçu par', 'Motif', 'Statut', 'Arrivée', 'Attente', 'Durée']],
    body: rows.map((r) => [
      r.visitorFullName,
      r.employeeFullName,
      VISIT_REASON_LABELS[r.reason],
      VISIT_STATUS_LABELS[r.status],
      new Date(r.arrivalTime).toLocaleString('fr-FR'),
      formatDuration(r.waitSeconds),
      formatDuration(r.durationSeconds),
    ]),
    headStyles: { fillColor: [20, 82, 143], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [244, 246, 249] },
    styles: { fontSize: 9, cellPadding: 6 },
    margin: { left: 32, right: 32 },
  })

  const fileDate = generatedAt.toISOString().slice(0, 10)
  doc.save(`registre-visites-osero-${fileDate}.pdf`)
}
