/**
 * Fouad's SEO Toolkit - Local Stageshow Interactive Player
 * Authentic Stageshow faux UI walkthrough reproducing the React Stageshow kit locally.
 * Zero external dependencies. 100% offline.
 */
(function () {
  'use strict';

  function createStageshowPlayer(containerEl) {
    if (!containerEl) return;

    containerEl.innerHTML = `
      <div class="ss-player-wrapper">
        <div class="ss-player-toolbar">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="ss-pill-badge">Stageshow · Faux UI</span>
            <span style="font-size: 12px; color: var(--muted); font-family: var(--font-mono);">720 × 420 (DevTools)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button id="ss-btn-replay" class="btn btn-secondary btn-sm" style="padding: 4px 10px; font-size: 11px;">
              <i data-lucide="play" style="width: 12px; height: 12px;"></i>
              <span>Replay</span>
            </button>
          </div>
        </div>

        <div class="ss-stage-viewport" id="ss-stage">
          <!-- Animated Cursor -->
          <div class="ss-cursor" id="ss-cursor">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 3L11 21L14 13L21 10L4 3Z" fill="#131416" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
            <span class="ss-cursor-ripple" id="ss-ripple"></span>
          </div>

          <!-- Window Frame -->
          <div class="ss-window">
            <div class="ss-win-titlebar">
              <div class="ss-win-dots">
                <span style="background: #ff5f56;"></span>
                <span style="background: #ffbd2e;"></span>
                <span style="background: #27c93f;"></span>
              </div>
              <span class="ss-win-url">foverse.github.io/seo-toolkit</span>
              <div style="width: 48px;"></div>
            </div>

            <div class="ss-win-body">
              <!-- Top bar -->
              <div class="ss-body-header">
                <div class="ss-win-brand">
                  <div class="ss-brand-badge">
                    <i data-lucide="search" style="width: 13px; height: 13px; color: var(--accent);"></i>
                  </div>
                  <span style="font-size: 13px; font-weight: 600; color: var(--text);">Fouad's SEO Toolkit</span>
                </div>

                <div class="ss-url-input-box">
                  <i data-lucide="globe" style="width: 12px; height: 12px; color: var(--muted); flex-shrink: 0;"></i>
                  <span class="ss-url-text">shop.soundcraft.com/products/pro-wireless-headphones</span>
                  <button id="ss-run-audit-btn" class="ss-audit-btn" type="button">
                    <i data-lucide="play" style="width: 11px; height: 11px;"></i>
                    <span id="ss-run-btn-label">Run Audit</span>
                  </button>
                </div>
              </div>

              <!-- Navigation Tabs -->
              <div class="ss-nav-tabs">
                <button id="ss-tab-overview" class="ss-tab-btn active" type="button">
                  <i data-lucide="sliders" style="width: 12px; height: 12px;"></i>
                  <span>Audit Overview</span>
                </button>
                <button id="ss-tab-serp" class="ss-tab-btn" type="button">
                  <i data-lucide="eye" style="width: 12px; height: 12px;"></i>
                  <span>SERP Simulator</span>
                </button>
              </div>

              <!-- Pane 1: Overview -->
              <div id="ss-pane-overview" class="ss-pane active">
                <div class="ss-score-strip">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="ss-score-num">
                      <span id="ss-score-val">0</span>
                      <span style="font-size: 13px; font-weight: 400; color: var(--muted);">/100</span>
                    </div>
                    <span id="ss-optimal-pill" class="ss-status-badge hidden">
                      <i data-lucide="check-circle-2" style="width: 11px; height: 11px;"></i>
                      <span>Optimal Health</span>
                    </span>
                  </div>

                  <div class="ss-chip-group">
                    <span class="ss-chip">Meta: <b id="ss-meta-val" class="ss-chip-num">--</b></span>
                    <span class="ss-chip">Content: <b id="ss-content-val" class="ss-chip-num">--</b></span>
                    <span class="ss-chip">Assets: <b id="ss-assets-val" class="ss-chip-num">--</b></span>
                    <span class="ss-chip">Links: <b id="ss-links-val" class="ss-chip-num">--</b></span>
                    <span class="ss-chip">Schema: <b id="ss-schema-val" class="ss-chip-num">--</b></span>
                  </div>
                </div>

                <div class="ss-kpi-grid">
                  <div class="ss-kpi-item">
                    <span id="ss-kpi-words" class="ss-kpi-val">—</span>
                    <span class="ss-kpi-lbl">Word Count</span>
                  </div>
                  <div class="ss-kpi-item">
                    <span id="ss-kpi-read" class="ss-kpi-val">—</span>
                    <span class="ss-kpi-lbl">Read Time</span>
                  </div>
                  <div class="ss-kpi-item">
                    <span id="ss-kpi-h1" class="ss-kpi-val">—</span>
                    <span class="ss-kpi-lbl">H1 Heading</span>
                  </div>
                  <div class="ss-kpi-item">
                    <span id="ss-kpi-imgs" class="ss-kpi-val">—</span>
                    <span class="ss-kpi-lbl">Images (100% Alt)</span>
                  </div>
                </div>

                <div class="ss-checks-stack">
                  <div class="ss-check-line">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <i data-lucide="check-circle-2" style="width: 13px; height: 13px; color: var(--positive);"></i>
                      <span class="ss-bar-filler" style="width: 180px;"></span>
                    </div>
                    <span class="ss-bar-filler" style="width: 60px;"></span>
                  </div>
                  <div class="ss-check-line">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <i data-lucide="check-circle-2" style="width: 13px; height: 13px; color: var(--positive);"></i>
                      <span class="ss-bar-filler" style="width: 220px;"></span>
                    </div>
                    <span class="ss-bar-filler" style="width: 50px;"></span>
                  </div>
                </div>
              </div>

              <!-- Pane 2: SERP Simulator -->
              <div id="ss-pane-serp" class="ss-pane">
                <div class="ss-serp-snippet-card">
                  <div class="ss-serp-cite-line">
                    <span class="ss-serp-dot"></span>
                    <span>SoundCraft › products › pro-wireless-headphones</span>
                  </div>
                  <div class="ss-serp-heading">
                    Pro Wireless Noise-Cancelling Headphones | SoundCraft
                  </div>
                  <div class="ss-serp-snippet-desc">
                    Experience studio-grade acoustics with our active noise-cancelling wireless headphones. 40-hour battery life and crystal clear call clarity.
                  </div>
                </div>

                <div class="ss-meter-container" id="ss-meter-box">
                  <div class="ss-meter-top">
                    <span style="font-weight: 600; color: var(--text);">Google Desktop Title Pixel Tracker</span>
                    <span style="font-family: var(--font-mono); font-weight: 600; color: var(--accent);">442px / 600px (Optimal)</span>
                  </div>
                  <div class="ss-meter-track" id="ss-meter-track">
                    <div class="ss-meter-fill" id="ss-meter-fill"></div>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--muted);">
                    <span>Meta description length: 142 chars (Target: 120-160)</span>
                    <span style="color: var(--positive);">100% Safe from SERP truncation</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize local lucide icons if available
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }

    const stage = document.getElementById('ss-stage');
    const cursor = document.getElementById('ss-cursor');
    const ripple = document.getElementById('ss-ripple');
    const runBtn = document.getElementById('ss-run-audit-btn');
    const runBtnLabel = document.getElementById('ss-run-btn-label');
    const tabOverview = document.getElementById('ss-tab-overview');
    const tabSerp = document.getElementById('ss-tab-serp');
    const paneOverview = document.getElementById('ss-pane-overview');
    const paneSerp = document.getElementById('ss-pane-serp');
    const scoreVal = document.getElementById('ss-score-val');
    const optimalPill = document.getElementById('ss-optimal-pill');
    const metaVal = document.getElementById('ss-meta-val');
    const contentVal = document.getElementById('ss-content-val');
    const assetsVal = document.getElementById('ss-assets-val');
    const linksVal = document.getElementById('ss-links-val');
    const schemaVal = document.getElementById('ss-schema-val');
    const kpiWords = document.getElementById('ss-kpi-words');
    const kpiRead = document.getElementById('ss-kpi-read');
    const kpiH1 = document.getElementById('ss-kpi-h1');
    const kpiImgs = document.getElementById('ss-kpi-imgs');
    const meterFill = document.getElementById('ss-meter-fill');
    const btnReplay = document.getElementById('ss-btn-replay');

    let animTimer = null;
    let isPlaying = false;

    function moveCursor(targetX, targetY, durationMs, cb) {
      cursor.style.transition = `left ${durationMs}ms cubic-bezier(0.45, 0, 0.1, 1), top ${durationMs}ms cubic-bezier(0.45, 0, 0.1, 1)`;
      cursor.style.left = `${targetX}px`;
      cursor.style.top = `${targetY}px`;
      if (cb) setTimeout(cb, durationMs);
    }

    function triggerClickRipple() {
      ripple.classList.remove('active');
      void ripple.offsetWidth; // reflow
      ripple.classList.add('active');
    }

    function countUp(targetNumber, durationMs, onComplete) {
      const start = 0;
      const startTime = performance.now();
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const current = Math.round(start + (targetNumber - start) * progress);
        scoreVal.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          scoreVal.textContent = targetNumber;
          if (onComplete) onComplete();
        }
      }
      requestAnimationFrame(update);
    }

    function resetDemo() {
      if (animTimer) clearTimeout(animTimer);
      paneOverview.classList.add('active');
      paneSerp.classList.remove('active');
      tabOverview.classList.add('active');
      tabSerp.classList.remove('active');
      scoreVal.textContent = '0';
      optimalPill.classList.add('hidden');
      metaVal.textContent = '--';
      contentVal.textContent = '--';
      assetsVal.textContent = '--';
      linksVal.textContent = '--';
      schemaVal.textContent = '--';
      kpiWords.textContent = '—';
      kpiRead.textContent = '—';
      kpiH1.textContent = '—';
      kpiImgs.textContent = '—';
      runBtn.classList.remove('active');
      runBtnLabel.textContent = 'Run Audit';
      meterFill.style.width = '0%';
      cursor.style.left = '560px';
      cursor.style.top = '340px';
    }

    function playWalkthrough() {
      resetDemo();
      isPlaying = true;

      // 1. Pause at rest, then move to "Run Audit" button
      animTimer = setTimeout(() => {
        const stageRect = stage.getBoundingClientRect();
        const btnRect = runBtn.getBoundingClientRect();
        const targetX = btnRect.left - stageRect.left + btnRect.width / 2;
        const targetY = btnRect.top - stageRect.top + btnRect.height / 2;

        moveCursor(targetX, targetY, 650, () => {
          // Hover pause
          setTimeout(() => {
            triggerClickRipple();
            runBtn.classList.add('active');
            runBtnLabel.textContent = 'Auditing...';

            // 2. Audit resolves
            setTimeout(() => {
              runBtn.classList.remove('active');
              runBtnLabel.textContent = 'Run Audit';
              optimalPill.classList.remove('hidden');

              // Roll score to 92
              countUp(92, 500, () => {
                metaVal.textContent = '95%';
                contentVal.textContent = '90%';
                assetsVal.textContent = '85%';
                linksVal.textContent = '92%';
                schemaVal.textContent = '100%';
                kpiWords.textContent = '403';
                kpiRead.textContent = '2.0m';
                kpiH1.textContent = '1';
                kpiImgs.textContent = '2';

                // 3. Move cursor to SERP tab
                setTimeout(() => {
                  const serpTabRect = tabSerp.getBoundingClientRect();
                  const tabX = serpTabRect.left - stageRect.left + serpTabRect.width / 2;
                  const tabY = serpTabRect.top - stageRect.top + serpTabRect.height / 2;

                  moveCursor(tabX, tabY, 550, () => {
                    triggerClickRipple();
                    tabOverview.classList.remove('active');
                    tabSerp.classList.add('active');
                    paneOverview.classList.remove('active');
                    paneSerp.classList.add('active');
                    meterFill.style.width = '74%';

                    // 4. Move cursor to inspect meter bar
                    setTimeout(() => {
                      const trackRect = document.getElementById('ss-meter-track').getBoundingClientRect();
                      const trackX = trackRect.left - stageRect.left + trackRect.width * 0.74;
                      const trackY = trackRect.top - stageRect.top + trackRect.height / 2;

                      moveCursor(trackX, trackY, 450, () => {
                        // Payoff holds for 3s
                        setTimeout(() => {
                          // Move cursor to quiet rest
                          moveCursor(560, 340, 600, () => {
                            // Seamless loop after 2 seconds
                            setTimeout(() => {
                              if (isPlaying) playWalkthrough();
                            }, 2000);
                          });
                        }, 3000);
                      });
                    }, 400);
                  });
                }, 800);
              });
            }, 450);
          }, 200);
        });
      }, 700);
    }

    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        playWalkthrough();
      });
    }

    tabOverview.addEventListener('click', () => {
      tabOverview.classList.add('active');
      tabSerp.classList.remove('active');
      paneOverview.classList.add('active');
      paneSerp.classList.remove('active');
    });

    tabSerp.addEventListener('click', () => {
      tabSerp.classList.add('active');
      tabOverview.classList.remove('active');
      paneSerp.classList.add('active');
      paneOverview.classList.remove('active');
      meterFill.style.width = '74%';
    });

    // Start playback
    playWalkthrough();

    return {
      play: playWalkthrough,
      reset: resetDemo,
      destroy: () => {
        if (animTimer) clearTimeout(animTimer);
        isPlaying = false;
      }
    };
  }

  window.createStageshowPlayer = createStageshowPlayer;
})();
