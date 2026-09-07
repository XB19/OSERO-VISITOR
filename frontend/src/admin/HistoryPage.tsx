import { AppShell } from '../components/AppShell'
import { VisitHistoryView } from '../components/VisitHistoryView'
import { ADMIN_LINKS } from './links'

export function HistoryPage() {
  return (
    <AppShell title="Administration" links={ADMIN_LINKS}>
      <VisitHistoryView apiUrl="/api/admin/visits/history" />
    </AppShell>
  )
}
