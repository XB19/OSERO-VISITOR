import { useEffect, useState } from 'react'
import { apiClient } from '../../api/client'
import type { EmployeeSummary } from '../../types'

export function EmployeeStep({
  selected,
  onBack,
  onNext,
}: {
  selected: EmployeeSummary | null
  onBack: () => void
  onNext: (employee: EmployeeSummary) => void
}) {
  const [employees, setEmployees] = useState<EmployeeSummary[]>([])
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<EmployeeSummary | null>(selected)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    apiClient
      .get<EmployeeSummary[]>('/api/kiosk/employees')
      .then((res) => setEmployees(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const filtered = employees.filter((e) =>
    e.fullName.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="kiosk-panel">
      <h1 className="kiosk-title">Qui souhaitez-vous rencontrer ?</h1>
      <p className="kiosk-subtitle">Recherchez ou sélectionnez la personne concernée</p>

      <div className="kiosk-field">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par nom..."
        />
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="kiosk-error">Impossible de charger la liste. Veuillez contacter l'accueil.</p>}

      <div className="kiosk-employee-list">
        {filtered.map((e) => (
          <button
            key={e.id}
            className={`kiosk-employee-card ${picked?.id === e.id ? 'selected' : ''}`}
            onClick={() => setPicked(e)}
          >
            <div className="name">{e.fullName}</div>
            <div className="meta">
              {[e.jobTitle, e.departmentName].filter(Boolean).join(' — ') || 'Employé OSERO'}
            </div>
          </button>
        ))}
        {!loading && !error && filtered.length === 0 && <p>Aucun résultat</p>}
      </div>

      <div className="kiosk-nav">
        <button className="btn btn-secondary" onClick={onBack}>
          Retour
        </button>
        <button className="btn btn-primary" disabled={!picked} onClick={() => picked && onNext(picked)}>
          Continuer
        </button>
      </div>
    </div>
  )
}
