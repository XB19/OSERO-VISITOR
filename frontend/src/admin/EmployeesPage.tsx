import { useEffect, useState, type FormEvent } from 'react'
import { apiClient } from '../api/client'
import { AppShell } from '../components/AppShell'
import { ADMIN_LINKS } from './links'
import type { Building, Department, EmployeeDetail, EmployeeRole, Floor, Office } from '../types'

const ROLE_LABELS: Record<EmployeeRole, string> = {
  EMPLOYEE: 'Employé',
  SECRETARIAT: 'Secrétariat',
  SECURITY: 'Sécurité',
  ADMIN: 'Administrateur',
}

const AVAILABILITY_LABELS: Record<string, string> = {
  DISPONIBLE: 'Disponible',
  ABSENT: 'Absent',
  INDISPONIBLE: 'Indisponible',
}

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  professionalEmail: '',
  professionalPhone: '',
  password: '',
  role: 'EMPLOYEE' as EmployeeRole,
  departmentId: '',
  buildingId: '',
  floorId: '',
  officeId: '',
}

export function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeDetail[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [buildings, setBuildings] = useState<Building[]>([])
  const [floors, setFloors] = useState<Floor[]>([])
  const [offices, setOffices] = useState<Office[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function refreshEmployees() {
    const { data } = await apiClient.get<EmployeeDetail[]>('/api/admin/employees')
    setEmployees(data)
  }

  useEffect(() => {
    refreshEmployees()
    apiClient.get<Department[]>('/api/admin/departments').then((res) => setDepartments(res.data))
    apiClient.get<Building[]>('/api/admin/buildings').then((res) => setBuildings(res.data))
  }, [])

  useEffect(() => {
    if (!form.buildingId) {
      setFloors([])
      return
    }
    apiClient
      .get<Floor[]>('/api/admin/floors', { params: { buildingId: form.buildingId } })
      .then((res) => setFloors(res.data))
  }, [form.buildingId])

  useEffect(() => {
    if (!form.floorId) {
      setOffices([])
      return
    }
    apiClient
      .get<Office[]>('/api/admin/offices', { params: { floorId: form.floorId } })
      .then((res) => setOffices(res.data))
  }, [form.floorId])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await apiClient.post('/api/admin/employees', {
        firstName: form.firstName,
        lastName: form.lastName,
        jobTitle: form.jobTitle || null,
        professionalEmail: form.professionalEmail,
        professionalPhone: form.professionalPhone || null,
        password: form.password,
        role: form.role,
        departmentId: form.departmentId || null,
        buildingId: form.buildingId || null,
        floorId: form.floorId || null,
        officeId: form.officeId || null,
      })
      setForm(EMPTY_FORM)
      await refreshEmployees()
    } catch {
      setError("Impossible de créer l'employé (e-mail déjà utilisé ?).")
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteEmployee(id: string) {
    await apiClient.delete(`/api/admin/employees/${id}`)
    await refreshEmployees()
  }

  return (
    <AppShell title="Administration" links={ADMIN_LINKS}>
      <h2 className="section-title">Nouvel employé</h2>
      <form className="card simple-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            required
            placeholder="Prénom"
            value={form.firstName}
            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
          />
          <input
            required
            placeholder="Nom"
            value={form.lastName}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
          />
          <input
            placeholder="Fonction"
            value={form.jobTitle}
            onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))}
          />
          <select
            value={form.departmentId}
            onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))}
          >
            <option value="">Département —</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <input
            required
            type="email"
            placeholder="E-mail professionnel"
            value={form.professionalEmail}
            onChange={(e) => setForm((f) => ({ ...f, professionalEmail: e.target.value }))}
          />
          <input
            placeholder="Téléphone professionnel"
            value={form.professionalPhone}
            onChange={(e) => setForm((f) => ({ ...f, professionalPhone: e.target.value }))}
          />
          <input
            type="password"
            placeholder="Mot de passe (si connexion requise)"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as EmployeeRole }))}
          >
            <option value="EMPLOYEE">Employé (pas de connexion)</option>
            <option value="SECRETARIAT">Secrétariat</option>
            <option value="SECURITY">Sécurité</option>
            <option value="ADMIN">Administrateur</option>
          </select>
        </div>

        <div className="form-row">
          <select
            value={form.buildingId}
            onChange={(e) => setForm((f) => ({ ...f, buildingId: e.target.value, floorId: '', officeId: '' }))}
          >
            <option value="">Bâtiment —</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <select
            value={form.floorId}
            disabled={!form.buildingId}
            onChange={(e) => setForm((f) => ({ ...f, floorId: e.target.value, officeId: '' }))}
          >
            <option value="">Étage —</option>
            {floors.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
          <select
            value={form.officeId}
            disabled={!form.floorId}
            onChange={(e) => setForm((f) => ({ ...f, officeId: e.target.value }))}
          >
            <option value="">Bureau —</option>
            {offices.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="kiosk-error">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Création...' : 'Créer l\'employé'}
        </button>
      </form>

      <h2 className="section-title">Employés</h2>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Fonction</th>
              <th>Département</th>
              <th>E-mail</th>
              <th>Rôle</th>
              <th>Localisation</th>
              <th>Disponibilité</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id}>
                <td>
                  {e.firstName} {e.lastName}
                </td>
                <td>{e.jobTitle ?? '—'}</td>
                <td>{e.departmentName ?? '—'}</td>
                <td>{e.professionalEmail}</td>
                <td>
                  <span className="badge badge-info">
                    <span className="badge-dot" />
                    {ROLE_LABELS[e.role]}
                  </span>
                </td>
                <td>{e.locationLabel || '—'}</td>
                <td>{AVAILABILITY_LABELS[e.availability] ?? e.availability}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => deleteEmployee(e.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
