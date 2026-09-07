import './animated-background.css'

/** Fond anime (degrade + formes flottantes) utilise derriere la borne et l'ecran de connexion. */
export function AnimatedBackground() {
  return (
    <div className="anim-bg" aria-hidden="true">
      <span className="anim-bg-blob blob-1" />
      <span className="anim-bg-blob blob-2" />
      <span className="anim-bg-blob blob-3" />
      <span className="anim-bg-blob blob-4" />
      <div className="anim-bg-grid" />
    </div>
  )
}
