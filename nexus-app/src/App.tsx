import { lazy, Suspense } from 'react'

const AgentUniverse = lazy(() => import('./components/LiquidGlassUniverse'))
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity, ArrowUpRight, Bot, CircleDollarSign,
  Clock3, Radio, RefreshCw, Search, ShieldCheck,
  Zap, Network, ExternalLink
} from 'lucide-react'
import { getA2AData } from './lib/a2a'
import type { A2AStats, A2ATransaction } from './lib/a2a'
import './App.css'

const money = (n: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(n)

const short = (s: string | null | undefined) => s ? `${s.slice(0, 7)}...${s.slice(-5)}` : 'Pending'

function App() {
  const [stats, setStats] = useState<A2AStats | null>(null)
  const [rows, setRows] = useState<A2ATransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [updated, setUpdated] = useState<Date | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const data = await getA2AData()
        if (!active) return
        setStats(data.stats)
        setRows(data.feed.rows)
        setUpdated(new Date())
        setError('')
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Connection failed')
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    const timer = window.setInterval(() => void load(), 30000)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [])

  const agents = useMemo(() => {
    const map = new Map<string, { name: string; calls: number; volume: number; latency: number }>()
    for (const tx of rows) {
      const item = map.get(tx.agent) ?? {
        name: tx.agentName || tx.agent,
        calls: 0, volume: 0, latency: 0
      }
      item.calls++
      item.volume += Number(tx.usd) || 0
      item.latency += Number(tx.ms) || 0
      map.set(tx.agent, item)
    }
    return [...map.entries()]
      .map(([id, item]) => ({ id, ...item, latency: item.latency / item.calls }))
      .sort((a, b) => b.calls - a.calls)
  }, [rows])

  const filtered = rows.filter(tx =>
    `${tx.agentName} ${tx.skill} ${tx.tx} ${tx.payer}`
      .toLowerCase().includes(search.toLowerCase())
  )

  const cards = [
    { label: 'CALLS / 24H', value: stats?.calls24h ?? '—', icon: Activity, color: 'cyan' },
    { label: 'SETTLED / 24H', value: stats ? `$${money(stats.settled24h)}` : '—', icon: CircleDollarSign, color: 'purple' },
    { label: 'TOTAL TRANSACTIONS', value: stats?.callsAll ?? '—', icon: Zap, color: 'blue' },
    { label: 'TOTAL SETTLED', value: stats ? `$${money(stats.settledAll)}` : '—', icon: ArrowUpRight, color: 'green' },
    { label: 'MEDIAN LATENCY', value: stats ? `${stats.p50ms}ms` : '—', icon: Clock3, color: 'orange' },
    { label: 'LIVE AGENTS', value: stats?.live ?? '—', icon: Bot, color: 'cyan' }
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-symbol"><Network size={23} /></div>
          <div><strong>A2A NEXUS</strong><small>THE LIVING ECONOMY</small></div>
        </div>
        <div className="sidebar-label">COMMAND CENTER</div>
        <nav>
          <a className="nav-active" href="#overview"><Activity size={18}/> Overview</a>
          <a href="#network"><Network size={18}/> Agent Network</a>
          <a href="#transactions"><Zap size={18}/> Transactions</a>
          <a href="#agents"><Bot size={18}/> Agent Intelligence</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="system-dot" /> SYSTEM MONITORING
          <p>Powered by the A2A live feed</p>
          <span>ROBINHOOD CHAIN · USDG</span>
        </div>
      </aside>

      <main id="overview" className="main">
        <header className="topbar">
          <div className="breadcrumb">A2A ECOSYSTEM <span>/</span> COMMAND CENTER</div>
          <div className="top-actions">
            <span className="live-pill"><Radio size={13}/> LIVE DATA</span>
            <span className="update-time">{updated ? `Updated ${updated.toLocaleTimeString()}` : 'Connecting...'}</span>
          </div>
        </header>

        <div className="content">
          <div className="heading">
            <div>
              <div className="eyebrow"><span className="pulse-dot"/> AUTONOMOUS ECONOMY INTELLIGENCE</div>
              <h1>Network <span>Command Center</span></h1>
              <p>Observe the machine economy as it happens. Every call. Every settlement. Every agent.</p>
            </div>
            <div className="status-chip"><ShieldCheck size={16}/> ON-CHAIN VERIFIED</div>
          </div>

          {error && <div className="error-banner">API connection issue: {error}. Retrying automatically.</div>}

          <section className="stats-grid">
            {cards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div className={`stat-card accent-${card.color}`} key={card.label}
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <div className="stat-top"><span>{card.label}</span><Icon size={19}/></div>
                  <strong>{card.value}</strong>
                  <small>{loading ? 'Connecting to network' : 'A2A verified data'}</small>
                </motion.div>
              )
            })}
          </section>

          <section className="main-grid">
            <div id="network" className="panel network-panel">
              <div className="panel-head">
                <div><span className="section-kicker">NETWORK TOPOLOGY</span><h2>Liquid Glass Universe</h2></div>
                <span className="panel-meta"><span className="pulse-dot"/> {agents.length} IN FEED</span>
              </div>
              <div className="network-stage" style={{height: 490, overflow: 'hidden', position: 'relative'}}>
                <Suspense fallback={
                  <div style={{
                    height: '100%',
                    minHeight: 460,
                    display: 'grid',
                    placeItems: 'center',
                    background: 'radial-gradient(ellipse, #15285a, #070c1c)',
                    color: '#67e8f9',
                    fontSize: 13,
                    letterSpacing: 2
                  }}>
                    INITIALIZING 3D AGENT UNIVERSE...
                  </div>
                }>
                  <AgentUniverse agents={agents} selected={selected} onSelect={setSelected} />
                </Suspense>
                <div className="network-caption" style={{zIndex: 5, pointerEvents: 'none'}}>
                  LIVE 3D AGENT UNIVERSE · DRAG TO ROTATE · SCROLL TO ZOOM
                </div>
              </div>
              {selected && (
                <div className="selected-agent">
                  <Bot size={16}/>
                  <strong>{agents.find(a => a.id === selected)?.name}</strong>
                  <span>{agents.find(a => a.id === selected)?.calls} recorded calls</span>
                  <span>${money(agents.find(a => a.id === selected)?.volume ?? 0)} volume</span>
                  <button onClick={() => setSelected(null)}>✕</button>
                </div>
              )}
            </div>

            <div id="agents" className="panel leaderboard-panel">
              <div className="panel-head">
                <div><span className="section-kicker">AGENT INTELLIGENCE</span><h2>Top Performers</h2></div>
                <Bot size={18} className="dim-icon"/>
              </div>
              <div className="leaderboard">
                {agents.slice(0, 7).map((agent, i) => (
                  <button className="leader-row" key={agent.id} onClick={() => setSelected(agent.id)}>
                    <span className="rank">{String(i + 1).padStart(2, '0')}</span>
                    <span className="agent-avatar"><Bot size={17}/></span>
                    <span className="leader-name"><strong>{agent.name}</strong><small>{agent.calls} calls · {Math.round(agent.latency)}ms avg</small></span>
                    <span className="leader-value">${money(agent.volume)}</span>
                  </button>
                ))}
                {agents.length === 0 && <p className="empty">Waiting for agent activity...</p>}
              </div>
              <div className="leader-footer">Ranked by transactions in the returned feed</div>
            </div>
          </section>

          <section id="transactions" className="panel transactions-panel">
            <div className="panel-head transactions-head">
              <div><span className="section-kicker">ON-CHAIN ACTIVITY</span><h2>Live Transaction Stream</h2></div>
              <div className="table-actions">
                <div className="search-box"><Search size={16}/><input placeholder="Search agent, skill or transaction..." value={search} onChange={e => setSearch(e.target.value)}/></div>
                <span className="refresh-label"><RefreshCw size={14}/> 30s refresh</span>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>AGENT / SKILL</th><th>TRANSACTION</th><th>VALUE</th><th>LATENCY</th><th>TIME</th><th>VERIFY</th></tr></thead>
                <tbody>
                  {filtered.slice(0, 30).map(tx => (
                    <tr key={tx.tx}>
                      <td><div className="table-agent"><span className="table-agent-icon"><Bot size={16}/></span><div><strong>{tx.agentName || tx.agent}</strong><small>{tx.skill}</small></div></div></td>
                      <td className="mono">{short(tx.tx)}</td>
                      <td className="amount">${money(tx.usd)} <small>{tx.asset}</small></td>
                      <td>{tx.ms}ms</td>
                      <td className="muted">{new Date(tx.at).toLocaleString()}</td>
                      <td><a className="explorer-link" href={tx.explorer} target="_blank" rel="noopener noreferrer" aria-label="Verify transaction"><ExternalLink size={16}/></a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="empty">{loading ? 'Loading transactions...' : 'No matching transactions found.'}</p>}
            </div>
            <div className="table-footer"><span>Displaying {Math.min(filtered.length, 30)} of {filtered.length} feed transactions</span><span><span className="pulse-dot"/> AUTOMATIC UPDATES ENABLED</span></div>
          </section>

          <footer><span>A2A NEXUS © 2026 · THE LIVING AGENT ECONOMY</span><span>DATA SOURCE: API.A2A.FAMILY <ExternalLink size={12}/></span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
