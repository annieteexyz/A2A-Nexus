import { useEffect, useState } from 'react'

type Props = {
  agentId: string
  name: string
  color: string
}

const logoCache = new Map<string, string | null>()

export default function AgentLogo({ agentId, name, color }: Props) {
  const [logo, setLogo] = useState<string | null>(
    () => logoCache.get(agentId) ?? null
  )
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    setFailed(false)

    if (logoCache.has(agentId)) {
      setLogo(logoCache.get(agentId) ?? null)
      return
    }

    const controller = new AbortController()

    async function loadLogo() {
      try {
        const response = await fetch(
          `https://api.a2a.family/a/${encodeURIComponent(agentId)}/.well-known/agent-card.json`,
          { signal: controller.signal }
        )

        if (!response.ok) throw new Error('Card unavailable')

        const card = await response.json()
        const candidate = card.iconUrl

        let verified: string | null = null

        if (typeof candidate === 'string') {
          const url = new URL(candidate)

          if (
            url.protocol === 'https:' &&
            url.hostname === 'api.a2a.family'
          ) {
            verified = url.href
          }
        }

        logoCache.set(agentId, verified)
        if (active) setLogo(verified)
      } catch {
        if (active && !controller.signal.aborted) {
          logoCache.set(agentId, null)
          setLogo(null)
        }
      }
    }

    loadLogo()

    return () => {
      active = false
      controller.abort()
    }
  }, [agentId])

  const initials = name
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div style={{
      width: 58,
      height: 58,
      borderRadius: '50%',
      display: 'grid',
      placeItems: 'center',
      overflow: 'hidden',
      background: 'rgba(13, 18, 46, 0.78)',
      border: `2px solid ${color}`,
      boxShadow: `0 0 22px ${color}88, inset 0 0 16px ${color}44`,
      backdropFilter: 'blur(14px)',
      color: '#ffffff',
      fontWeight: 800,
      fontSize: 18
    }}>
      {logo && !failed ? (
        <img
          src={logo}
          alt={`${name} logo`}
          onError={() => setFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
