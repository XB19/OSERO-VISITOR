export function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="kiosk-panel">
      <h1 className="kiosk-title">Bienvenue chez OSERO</h1>
      <p className="kiosk-subtitle">Un accueil plus simple. Une communication plus rapide.</p>
      <button className="btn btn-primary kiosk-big-btn pulse" onClick={onStart}>
        COMMENCER
      </button>
    </div>
  )
}
