import { useState } from 'react'

export function IdentityStep({
  firstName,
  lastName,
  onBack,
  onNext,
}: {
  firstName: string
  lastName: string
  onBack: () => void
  onNext: (firstName: string, lastName: string) => void
}) {
  const [first, setFirst] = useState(firstName)
  const [last, setLast] = useState(lastName)

  const canContinue = first.trim().length > 0 && last.trim().length > 0

  return (
    <div className="kiosk-panel">
      <h1 className="kiosk-title">Qui êtes-vous ?</h1>
      <p className="kiosk-subtitle">Merci de renseigner votre identité</p>

      <div className="kiosk-field">
        <label htmlFor="firstName">Prénom</label>
        <input
          id="firstName"
          autoFocus
          value={first}
          onChange={(e) => setFirst(e.target.value)}
          placeholder="Votre prénom"
        />
      </div>

      <div className="kiosk-field">
        <label htmlFor="lastName">Nom</label>
        <input
          id="lastName"
          value={last}
          onChange={(e) => setLast(e.target.value)}
          placeholder="Votre nom"
        />
      </div>

      <div className="kiosk-nav">
        <button className="btn btn-secondary" onClick={onBack}>
          Retour
        </button>
        <button
          className="btn btn-primary"
          disabled={!canContinue}
          onClick={() => onNext(first.trim(), last.trim())}
        >
          Continuer
        </button>
      </div>
    </div>
  )
}
