import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { useAuth } from './AuthContext'
import { AnimatedBackground } from '../components/AnimatedBackground'

const ROLE_HOME: Record<string, string> = {
  ADMIN: '/admin',
  SECRETARIAT: '/secretariat',
  SECURITY: '/security',
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const user = await login(email, password)
      navigate(ROLE_HOME[user.role] ?? '/')
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        setError('Identifiants invalides.')
      } else {
        setError("Connexion au serveur impossible. Vérifiez que l'API est démarrée et accessible.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="kiosk">
      <AnimatedBackground />
      <div className="kiosk-logo">
        <span className="dot" />
        OSERO VISITOR
      </div>
      <form className="kiosk-panel" style={{ maxWidth: 420 }} onSubmit={handleSubmit}>
        <h1 className="kiosk-title">Connexion</h1>
        <p className="kiosk-subtitle">Espace secrétariat / sécurité / administration</p>

        <div className="kiosk-field">
          <label htmlFor="email">E-mail professionnel</label>
          <input
            id="email"
            type="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prenom.nom@osero.com"
          />
        </div>

        <div className="kiosk-field">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="kiosk-error">{error}</p>}

        <button className="btn btn-primary kiosk-big-btn" type="submit" disabled={submitting}>
          {submitting ? 'Connexion...' : 'Se connecter'}
        </button>

        <Link
          to="/"
          style={{
            display: 'block',
            marginTop: 20,
            fontSize: '0.9rem',
            color: 'var(--osero-text-muted)',
            textDecoration: 'none',
          }}
        >
          ← Retour à la borne visiteur
        </Link>
      </form>
    </div>
  )
}
