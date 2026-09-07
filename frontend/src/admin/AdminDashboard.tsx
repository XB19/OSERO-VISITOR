import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'
import { AppShell } from '../components/AppShell'
import { ADMIN_LINKS } from './links'
import type { DashboardStats } from '../types'

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    apiClient.get<DashboardStats>('/api/admin/dashboard').then((res) => setStats(res.data))
  }, [])

  return (
    <AppShell title="Administration" links={ADMIN_LINKS}>
      <h2 className="section-title">Tableau de bord</h2>
      <p className="section-subtitle">Vue d'ensemble de l'activité du jour</p>

      <div className="stat-grid">
        <div className="card stat-card">
          <span className="icon">🚪</span>
          {stats ? <div className="value">{stats.visitorsToday}</div> : <div className="skeleton" style={{ height: 34, width: 60 }} />}
          <div className="label">Visiteurs du jour</div>
        </div>
        <div className="card stat-card accent-success">
          <span className="icon">👥</span>
          {stats ? <div className="value">{stats.visitorsPresent}</div> : <div className="skeleton" style={{ height: 34, width: 60 }} />}
          <div className="label">Visiteurs présents</div>
        </div>
        <div className="card stat-card accent-warning">
          <span className="icon">⏳</span>
          {stats ? <div className="value">{stats.visitsWaiting}</div> : <div className="skeleton" style={{ height: 34, width: 60 }} />}
          <div className="label">Visites en attente</div>
        </div>
        <div className="card stat-card">
          <span className="icon">✅</span>
          {stats ? <div className="value">{stats.visitsCompleted}</div> : <div className="skeleton" style={{ height: 34, width: 60 }} />}
          <div className="label">Visites terminées</div>
        </div>
        <div className="card stat-card accent-danger">
          <span className="icon">🚫</span>
          {stats ? <div className="value">{stats.visitsRefused}</div> : <div className="skeleton" style={{ height: 34, width: 60 }} />}
          <div className="label">Visites refusées</div>
        </div>
        <div className="card stat-card">
          <span className="icon">⏱️</span>
          {stats ? (
            <div className="value">{stats.averageWaitMinutes.toFixed(1)} min</div>
          ) : (
            <div className="skeleton" style={{ height: 34, width: 60 }} />
          )}
          <div className="label">Temps moyen d'attente</div>
        </div>
      </div>
    </AppShell>
  )
}
