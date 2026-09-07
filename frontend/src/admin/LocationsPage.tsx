import { useEffect, useState, type FormEvent } from 'react'
import { apiClient } from '../api/client'
import { AppShell } from '../components/AppShell'
import { ADMIN_LINKS } from './links'
import type { Building, Department, Floor, Office } from '../types'

export function LocationsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [buildings, setBuildings] = useState<Building[]>([])
  const [floors, setFloors] = useState<Floor[]>([])
  const [offices, setOffices] = useState<Office[]>([])

  const [departmentName, setDepartmentName] = useState('')
  const [buildingName, setBuildingName] = useState('')
  const [floorBuildingId, setFloorBuildingId] = useState('')
  const [floorLabel, setFloorLabel] = useState('')
  const [officeFloorId, setOfficeFloorId] = useState('')
  const [officeLabel, setOfficeLabel] = useState('')

  async function refreshAll() {
    const [d, b, f, o] = await Promise.all([
      apiClient.get<Department[]>('/api/admin/departments'),
      apiClient.get<Building[]>('/api/admin/buildings'),
      apiClient.get<Floor[]>('/api/admin/floors'),
      apiClient.get<Office[]>('/api/admin/offices'),
    ])
    setDepartments(d.data)
    setBuildings(b.data)
    setFloors(f.data)
    setOffices(o.data)
  }

  useEffect(() => {
    refreshAll()
  }, [])

  async function addDepartment(e: FormEvent) {
    e.preventDefault()
    if (!departmentName.trim()) return
    await apiClient.post('/api/admin/departments', { name: departmentName.trim() })
    setDepartmentName('')
    await refreshAll()
  }

  async function addBuilding(e: FormEvent) {
    e.preventDefault()
    if (!buildingName.trim()) return
    await apiClient.post('/api/admin/buildings', { name: buildingName.trim() })
    setBuildingName('')
    await refreshAll()
  }

  async function addFloor(e: FormEvent) {
    e.preventDefault()
    if (!floorBuildingId || !floorLabel.trim()) return
    await apiClient.post('/api/admin/floors', { buildingId: floorBuildingId, label: floorLabel.trim() })
    setFloorLabel('')
    await refreshAll()
  }

  async function addOffice(e: FormEvent) {
    e.preventDefault()
    if (!officeFloorId || !officeLabel.trim()) return
    await apiClient.post('/api/admin/offices', { floorId: officeFloorId, label: officeLabel.trim() })
    setOfficeLabel('')
    await refreshAll()
  }

  async function remove(kind: 'departments' | 'buildings' | 'floors' | 'offices', id: string) {
    await apiClient.delete(`/api/admin/${kind}/${id}`)
    await refreshAll()
  }

  return (
    <AppShell title="Administration" links={ADMIN_LINKS}>
      <h2 className="section-title">Départements</h2>
      <form className="card simple-form" onSubmit={addDepartment}>
        <div className="form-row">
          <input
            placeholder="Nom du département"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Ajouter
          </button>
        </div>
      </form>
      <div className="card" style={{ marginBottom: 32 }}>
        <table className="data-table">
          <tbody>
            {departments.map((d) => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-danger" onClick={() => remove('departments', d.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Bâtiments</h2>
      <form className="card simple-form" onSubmit={addBuilding}>
        <div className="form-row">
          <input
            placeholder="Nom du bâtiment (ex: Bâtiment A)"
            value={buildingName}
            onChange={(e) => setBuildingName(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Ajouter
          </button>
        </div>
      </form>
      <div className="card" style={{ marginBottom: 32 }}>
        <table className="data-table">
          <tbody>
            {buildings.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-danger" onClick={() => remove('buildings', b.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Étages</h2>
      <form className="card simple-form" onSubmit={addFloor}>
        <div className="form-row">
          <select value={floorBuildingId} onChange={(e) => setFloorBuildingId(e.target.value)}>
            <option value="">Bâtiment —</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Étage (ex: R+2)"
            value={floorLabel}
            onChange={(e) => setFloorLabel(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Ajouter
          </button>
        </div>
      </form>
      <div className="card" style={{ marginBottom: 32 }}>
        <table className="data-table">
          <tbody>
            {floors.map((f) => (
              <tr key={f.id}>
                <td>{f.buildingName}</td>
                <td>{f.label}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-danger" onClick={() => remove('floors', f.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Bureaux</h2>
      <form className="card simple-form" onSubmit={addOffice}>
        <div className="form-row">
          <select value={officeFloorId} onChange={(e) => setOfficeFloorId(e.target.value)}>
            <option value="">Étage —</option>
            {floors.map((f) => (
              <option key={f.id} value={f.id}>
                {f.buildingName} — {f.label}
              </option>
            ))}
          </select>
          <input
            placeholder="Bureau (ex: Bureau 204)"
            value={officeLabel}
            onChange={(e) => setOfficeLabel(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Ajouter
          </button>
        </div>
      </form>
      <div className="card">
        <table className="data-table">
          <tbody>
            {offices.map((o) => (
              <tr key={o.id}>
                <td>{o.floorLabel}</td>
                <td>{o.label}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-danger" onClick={() => remove('offices', o.id)}>
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
