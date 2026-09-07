export type VisitReason =
  | 'RENDEZ_VOUS'
  | 'REUNION'
  | 'PARTENAIRE'
  | 'LIVRAISON'
  | 'RECRUTEMENT'
  | 'DEPOT_DOCUMENT'
  | 'AUTRE'

export const VISIT_REASON_LABELS: Record<VisitReason, string> = {
  RENDEZ_VOUS: 'Rendez-vous',
  REUNION: 'Réunion',
  PARTENAIRE: 'Partenaire',
  LIVRAISON: 'Livraison',
  RECRUTEMENT: 'Recrutement',
  DEPOT_DOCUMENT: 'Dépôt de document',
  AUTRE: 'Autre',
}

export type VisitStatus =
  | 'NOUVELLE_DEMANDE'
  | 'NOTIFICATION_ENVOYEE'
  | 'EN_ATTENTE'
  | 'ACCEPTEE'
  | 'REFUSEE'
  | 'EN_COURS'
  | 'TERMINEE'
  | 'ANNULEE'

export const VISIT_STATUS_LABELS: Record<VisitStatus, string> = {
  NOUVELLE_DEMANDE: 'Nouvelle demande',
  NOTIFICATION_ENVOYEE: 'Notification envoyée',
  EN_ATTENTE: 'En attente',
  ACCEPTEE: 'Acceptée',
  REFUSEE: 'Refusée',
  EN_COURS: 'En cours de visite',
  TERMINEE: 'Terminée',
  ANNULEE: 'Annulée',
}

export type EmployeeAvailability = 'DISPONIBLE' | 'ABSENT' | 'INDISPONIBLE'

export type EmployeeRole = 'ADMIN' | 'EMPLOYEE' | 'SECRETARIAT' | 'SECURITY'

export interface EmployeeSummary {
  id: string
  fullName: string
  jobTitle: string | null
  departmentName: string | null
  availability: EmployeeAvailability
}

export interface EmployeeDetail {
  id: string
  firstName: string
  lastName: string
  jobTitle: string | null
  departmentId: string | null
  departmentName: string | null
  professionalPhone: string | null
  professionalEmail: string
  role: EmployeeRole
  buildingId: string | null
  floorId: string | null
  officeId: string | null
  locationLabel: string | null
  availability: EmployeeAvailability
  active: boolean
}

export interface VisitStatusResponse {
  id: string
  status: VisitStatus
  visitorFullName: string
  employeeFullName: string
  locationSnapshot: string | null
  message: string
  overdue: boolean
}

export interface VisitRequestView {
  id: string
  visitorFullName: string
  reason: VisitReason
  reasonDetail: string | null
  employeeFullName: string
  employeeJobTitle: string | null
  employeePhone: string | null
  status: VisitStatus
  arrivalTime: string
  overdue: boolean
}

export interface VisitHistoryRow {
  id: string
  visitorFullName: string
  employeeFullName: string
  reason: VisitReason
  status: VisitStatus
  locationSnapshot: string | null
  arrivalTime: string
  respondedAt: string | null
  closedAt: string | null
  waitSeconds: number | null
  durationSeconds: number | null
}

export interface DashboardStats {
  visitorsToday: number
  visitorsPresent: number
  visitsWaiting: number
  visitsCompleted: number
  visitsRefused: number
  averageWaitMinutes: number
}

export interface Department {
  id: string
  name: string
}

export interface Building {
  id: string
  name: string
}

export interface Floor {
  id: string
  buildingId: string
  buildingName: string
  label: string
}

export interface Office {
  id: string
  floorId: string
  floorLabel: string
  label: string
}

export interface AuthUser {
  token: string
  employeeId: string
  fullName: string
  role: EmployeeRole
}
