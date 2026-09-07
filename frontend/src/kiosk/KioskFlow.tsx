import { useState } from 'react'
import { apiClient } from '../api/client'
import { AnimatedBackground } from '../components/AnimatedBackground'
import type { VisitReason, EmployeeSummary, VisitStatusResponse } from '../types'
import { EMPTY_DRAFT, type KioskStep, type VisitDraft } from './types'
import { WelcomeStep } from './steps/WelcomeStep'
import { IdentityStep } from './steps/IdentityStep'
import { ReasonStep } from './steps/ReasonStep'
import { EmployeeStep } from './steps/EmployeeStep'
import { SummaryStep } from './steps/SummaryStep'
import { StatusStep } from './steps/StatusStep'
import './kiosk.css'

export function KioskFlow() {
  const [step, setStep] = useState<KioskStep>('welcome')
  const [draft, setDraft] = useState<VisitDraft>(EMPTY_DRAFT)
  const [visitId, setVisitId] = useState<string | null>(null)

  function reset() {
    setDraft(EMPTY_DRAFT)
    setVisitId(null)
    setStep('welcome')
  }

  async function submitVisit() {
    const { data } = await apiClient.post<VisitStatusResponse>('/api/kiosk/visits', {
      visitorFirstName: draft.firstName,
      visitorLastName: draft.lastName,
      reason: draft.reason,
      reasonDetail: draft.reasonDetail || null,
      employeeId: draft.employee?.id,
    })
    setVisitId(data.id)
    setStep('status')
  }

  return (
    <div className="kiosk">
      <AnimatedBackground />
      <div className="kiosk-logo">
        <span className="dot" />
        OSERO VISITOR
      </div>

      {step === 'welcome' && <WelcomeStep onStart={() => setStep('identity')} />}

      {step === 'identity' && (
        <IdentityStep
          firstName={draft.firstName}
          lastName={draft.lastName}
          onBack={reset}
          onNext={(firstName, lastName) => {
            setDraft((d) => ({ ...d, firstName, lastName }))
            setStep('reason')
          }}
        />
      )}

      {step === 'reason' && (
        <ReasonStep
          reason={draft.reason}
          reasonDetail={draft.reasonDetail}
          onBack={() => setStep('identity')}
          onNext={(reason: VisitReason, reasonDetail: string) => {
            setDraft((d) => ({ ...d, reason, reasonDetail }))
            setStep('employee')
          }}
        />
      )}

      {step === 'employee' && (
        <EmployeeStep
          selected={draft.employee}
          onBack={() => setStep('reason')}
          onNext={(employee: EmployeeSummary) => {
            setDraft((d) => ({ ...d, employee }))
            setStep('summary')
          }}
        />
      )}

      {step === 'summary' && (
        <SummaryStep draft={draft} onBack={() => setStep('employee')} onConfirm={submitVisit} />
      )}

      {step === 'status' && visitId && <StatusStep visitId={visitId} onDone={reset} />}
    </div>
  )
}
