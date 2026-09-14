// Optional post-processing filters. Each filter is deliberately a toggle.
(() => {
  const filters = { vignette: 'Vignette', grain: 'Film grain', scanlines: 'Scanlines', glow: 'Display glow', pixelate: 'Pixelate', dither: 'Dither + color reduce' };
  const defaults = { vignette: true, grain: true, scanlines: false, glow: true, pixelate: false, dither: false };
  let settings = { ...defaults };
  try { const saved = JSON.parse(localStorage.getItem('defusal-post-processing')); for (const key of Object.keys(defaults)) if (typeof saved?.[key] === 'boolean') settings[key] = saved[key]; } catch {}
  Object.assign(translations, {
    'Visual settings': '视觉设置', 'Choose which animated filters are active.': '选择要启用的动态滤镜。',
    'Vignette': '暗角', 'Film grain': '胶片颗粒', 'Scanlines': '扫描线', 'Display glow': '显示屏辉光',
    'Pixelate': '像素化', 'Dither + color reduce': '抖动 + 减少色彩', 'Filters are paused while Effects is off.': '视觉效果关闭时，滤镜暂停。'
  });
  const panel = document.createElement('section'); panel.className = 'mission-panel post-settings';
  panel.innerHTML = '<details><summary>Visual settings</summary><p>Choose which animated filters are active.</p><div class="post-toggles" role="group" aria-label="Post-processing">' + Object.entries(filters).map(([key, label]) => `<button type="button" class="post-toggle" data-filter="${key}" aria-pressed="false">${label}: off</button>`).join('') + '</div><p class="post-paused">Filters are paused while Effects is off.</p></details>';
  document.querySelector('.sidebar').append(panel);
  const overlay = document.createElement('div'); overlay.className = 'post-overlay'; overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<i class="post-vignette"></i><i class="post-grain"></i><i class="post-scanlines"></i><i class="post-pixelate"></i><i class="post-dither"></i>';
  document.querySelector('.bomb-station').append(overlay);
  function renderSettings() { for (const [key, enabled] of Object.entries(settings)) { document.documentElement.style.setProperty('--post-' + key, enabled ? '1' : '0'); document.body.classList.toggle('post-' + key, enabled); const button = panel.querySelector(`[data-filter="${key}"]`); button.setAttribute('aria-pressed', String(enabled)); button.textContent = filters[key] + ': ' + (enabled ? 'on' : 'off'); } }
  function save() { renderSettings(); try { localStorage.setItem('defusal-post-processing', JSON.stringify(settings)); } catch {} }
  panel.addEventListener('click', event => { const button = event.target.closest('[data-filter]'); if (!button) return; const key = button.dataset.filter; settings[key] = !settings[key]; save(); });
  renderSettings(); applyLanguage();
})();
