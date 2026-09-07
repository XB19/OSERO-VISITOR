import { AppShell } from '../components/AppShell'
import { VisitHistoryView } from '../components/VisitHistoryView'
import { SECRETARIAT_LINKS } from './links'

export function RegisterPage() {
  return (
    <AppShell title="Secrétariat" links={SECRETARIAT_LINKS}>
      <VisitHistoryView apiUrl="/api/secretariat/visits/history" />
    </AppShell>
  )
}
