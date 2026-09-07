import type { EmployeeSummary, VisitReason } from '../types'

export type KioskStep = 'welcome' | 'identity' | 'reason' | 'employee' | 'summary' | 'status'

export interface VisitDraft {
  firstName: string
  lastName: string
  reason: VisitReason | null
  reasonDetail: string
  employee: EmployeeSummary | null
}

export const EMPTY_DRAFT: VisitDraft = {
  firstName: '',
  lastName: '',
  reason: null,
  reasonDetail: '',
  employee: null,
}
