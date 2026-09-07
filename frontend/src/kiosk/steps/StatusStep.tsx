import { useEffect, useRef, useState } from 'react'
import { apiClient } from '../../api/client'
import type { VisitStatusResponse } from '../../types'

const TERMINAL_STATUSES = new Set(['ACCEPTEE', 'EN_COURS', 'REFUSEE', 'TERMINEE', 'ANNULEE'])
const AUTO_RETURN_SECONDS = 20

function statusIcon(status: string) {
  if (status === 'ACCEPTEE' || status === 'EN_COURS') return '✅'
  if (status === 'REFUSEE') return '⚠️'
  return '⏳'
}

export function StatusStep({ visitId, onDone }: { visitId: string; onDone: () => void }) {
  const [statusResponse, setStatusResponse] = useState<VisitStatusResponse | null>(null)
  const [error, setError] = useState(false)
  const pollRef = useRef<number | null>(null)
  const autoReturnRef = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      try {
        const { data } = await apiClient.get<VisitStatusResponse>(`/api/kiosk/visits/${visitId}/status`)
        if (cancelled) return
        setStatusResponse(data)
        if (!TERMINAL_STATUSES.has(data.status)) {
          pollRef.current = window.setTimeout(poll, 3000)
        }
      } catch {
        if (!cancelled) setError(true)
      }
    }

    poll()
    return () => {
      cancelled = true
      if (pollRef.current) window.clearTimeout(pollRef.current)
    }
  }, [visitId])

  useEffect(() => {
    if (!statusResponse || !TERMINAL_STATUSES.has(statusResponse.status)) return
    autoReturnRef.current = window.setTimeout(onDone, AUTO_RETURN_SECONDS * 1000)
    return () => {
      if (autoReturnRef.current) window.clearTimeout(autoReturnRef.current)
    }
  }, [statusResponse, onDone])

  return (
    <div className="kiosk-panel">
      {error && (
        <>
          <div className="kiosk-status-icon">❌</div>
          <p className="kiosk-status-message">
            Connexion impossible. Merci de vous rapprocher de l'accueil.
          </p>
        </>
      )}

      {!error && !statusResponse && (
        <>
          <div className="kiosk-spinner" />
          <p className="kiosk-status-message">Envoi de votre demande...</p>
        </>
      )}

      {!error && statusResponse && (
        <>
          <div className="kiosk-status-icon">{statusIcon(statusResponse.status)}</div>
          {!TERMINAL_STATUSES.has(statusResponse.status) && <div className="kiosk-spinner" />}
          <p className="kiosk-status-message">{statusResponse.message}</p>
        </>
      )}

      <button className="btn btn-secondary kiosk-big-btn" onClick={onDone}>
        Nouvelle demande
      </button>
    </div>
  )
}
