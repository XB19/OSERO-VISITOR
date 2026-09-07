import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './app-shell.css'

export function AppShell({
  title,
  links,
  children,
}: {
  title: string
  links: { to: string; label: string }[]
  children: ReactNode
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-brand">
          <span className="dot" />
          OSERO VISITOR — {title}
        </div>
        <nav className="shell-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) => `shell-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="shell-user">
          <span className="name">{user?.fullName}</span>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>
      <main className="shell-content fade-in">{children}</main>
    </div>
  )
}
