import { Bar, Count, Stage, Window, type Act } from '../../kit'
import { CheckCircle2, Eye, Globe, Search, Sliders, Play, Check } from './icons'
import './seo-toolkit.css'

type S = {
  auditing: boolean
  audited: boolean
  score: number
  activeTab: 'overview' | 'serp'
  hoverBtn: boolean
}

const TARGET_URL = 'shop.soundcraft.com/products/pro-wireless-headphones'

const initial: S = {
  auditing: false,
  audited: false,
  score: 0,
  activeTab: 'overview',
  hoverBtn: false,
}

const poster: S = {
  auditing: false,
  audited: true,
  score: 92,
  activeTab: 'serp',
  hoverBtn: false,
}

async function script(a: Act<S>) {
  await a.wait(700)

  // 1. Cursor moves to "Run Audit" button
  await a.move('run-btn')
  await a.wait(250)
  a.put({ hoverBtn: true })
  await a.wait(150)
  await a.click('run-btn')
  a.put({ auditing: true, hoverBtn: false })
  await a.wait(400)

  // 2. Audit resolves: score counts up to 92
  a.put({ auditing: false, audited: true, score: 92 })
  await a.wait(600)

  // 3. Move cursor to SERP simulator tab
  await a.move('serp-tab')
  await a.wait(300)
  await a.click('serp-tab')
  a.put({ activeTab: 'serp' })
  await a.wait(400)

  // 4. Cursor inspects pixel width meter
  await a.move({ at: 'pixel-bar', x: 0.65, y: 0.5 })
  await a.wait(2200)

  // 5. Cursor rests quietly on margin
  await a.move({ at: 'run-btn', x: 2.2, y: 1.6 })
  await a.wait(800)

  // 6. Reset seam
  a.put({ activeTab: 'overview', audited: false, score: 0 })
  await a.wait(700)
}

export function SeoToolkitDemo() {
  return (
    <Stage<S>
      width={720}
      height={420}
      compact={{ below: 660, width: 358, height: 420 }}
      initial={initial}
      poster={poster}
      script={script}
      cursor={{ at: { x: 580, y: 360 } }}
      className="st-demo"
    >
      {(s) => (
        <Window url="foverse.github.io/seo-toolkit" className="st-win">
          <div className="st-container">
            {/* Header */}
            <div className="st-header">
              <div className="st-brand">
                <div className="st-brand-icon">
                  <Search size={12} />
                </div>
                <span>Fouad's SEO Toolkit</span>
              </div>

              <div className="st-url-bar">
                <Globe size={12} style={{ color: 'var(--ss-text-faint)', flexShrink: 0 }} />
                <span className="st-url-input">{TARGET_URL}</span>
                <button
                  type="button"
                  className="st-btn-audit"
                  data-target="run-btn"
                  data-active={s.hoverBtn || s.auditing || undefined}
                >
                  <Play size={12} fill="currentColor" />
                  <span>{s.auditing ? 'Auditing...' : 'Run Audit'}</span>
                </button>
              </div>
            </div>

            {/* Subnav Tabs */}
            <div className="st-tabs">
              <button
                type="button"
                className="st-tab"
                data-target="overview-tab"
                data-active={s.activeTab === 'overview' || undefined}
              >
                <Sliders size={12} />
                <span>Audit Overview</span>
              </button>
              <button
                type="button"
                className="st-tab"
                data-target="serp-tab"
                data-active={s.activeTab === 'serp' || undefined}
              >
                <Eye size={12} />
                <span>SERP Simulator</span>
              </button>
            </div>

            {/* Tab 1: Overview */}
            {s.activeTab === 'overview' && (
              <div className="st-overview">
                <div className="st-score-banner">
                  <div className="st-gauge-group">
                    <div className="st-gauge-badge">
                      <Count value={s.score} />
                      <span className="st-gauge-denom">/100</span>
                    </div>
                    {s.audited && (
                      <span className="st-status-pill">
                        <Check size={12} strokeWidth={3} />
                        <span>Optimal Health</span>
                      </span>
                    )}
                  </div>

                  <div className="st-chips">
                    <div className="st-chip">
                      <span>Meta:</span>
                      <span className="st-chip-val">{s.audited ? '95%' : '--'}</span>
                    </div>
                    <div className="st-chip">
                      <span>Content:</span>
                      <span className="st-chip-val">{s.audited ? '90%' : '--'}</span>
                    </div>
                    <div className="st-chip">
                      <span>Assets:</span>
                      <span className="st-chip-val">{s.audited ? '85%' : '--'}</span>
                    </div>
                    <div className="st-chip">
                      <span>Links:</span>
                      <span className="st-chip-val">{s.audited ? '92%' : '--'}</span>
                    </div>
                    <div className="st-chip">
                      <span>Schema:</span>
                      <span className="st-chip-val">{s.audited ? '100%' : '--'}</span>
                    </div>
                  </div>
                </div>

                <div className="st-kpis">
                  <div className="st-kpi-card">
                    <span className="st-kpi-val">{s.audited ? '403' : '—'}</span>
                    <span className="st-kpi-label">Word Count</span>
                  </div>
                  <div className="st-kpi-card">
                    <span className="st-kpi-val">{s.audited ? '2.0m' : '—'}</span>
                    <span className="st-kpi-label">Reading Time</span>
                  </div>
                  <div className="st-kpi-card">
                    <span className="st-kpi-val">{s.audited ? '1' : '—'}</span>
                    <span className="st-kpi-label">H1 Heading</span>
                  </div>
                  <div className="st-kpi-card">
                    <span className="st-kpi-val">{s.audited ? '2' : '—'}</span>
                    <span className="st-kpi-label">Images (100% Alt)</span>
                  </div>
                </div>

                <div className="st-checks">
                  <div className="st-check-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={12} style={{ color: 'var(--ss-success)' }} />
                      <Bar w={180} h={7} />
                    </div>
                    <Bar w={60} h={7} />
                  </div>
                  <div className="st-check-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={12} style={{ color: 'var(--ss-success)' }} />
                      <Bar w={220} h={7} />
                    </div>
                    <Bar w={50} h={7} />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: SERP Simulator */}
            {s.activeTab === 'serp' && (
              <div className="st-serp-pane">
                <div className="st-serp-card">
                  <div className="st-serp-cite">
                    <span className="st-serp-favicon" />
                    <span>SoundCraft › products › pro-wireless-headphones</span>
                  </div>
                  <div className="st-serp-title">
                    Pro Wireless Noise-Cancelling Headphones | SoundCraft
                  </div>
                  <div className="st-serp-desc">
                    Experience studio-grade acoustics with our active noise-cancelling wireless headphones. 40-hour battery life and crystal clear call clarity.
                  </div>
                </div>

                <div className="st-meter-box">
                  <div className="st-meter-head">
                    <span className="st-meter-label">Google Desktop Title Pixel Tracker</span>
                    <span style={{ fontFamily: 'var(--ss-mono)', fontWeight: 600, color: 'var(--ss-accent)' }}>
                      442px / 600px max (Optimal)
                    </span>
                  </div>
                  <div className="st-meter-bar-track" data-target="pixel-bar">
                    <div className="st-meter-bar-fill" style={{ width: '74%' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ss-text-faint)' }}>
                    <span>Meta description length: 142 chars (Target: 120-160)</span>
                    <span>100% Safe from SERP truncation</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Window>
      )}
    </Stage>
  )
}
