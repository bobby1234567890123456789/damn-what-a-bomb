// Static compositing avoids flicker and continuous rendering work.
(() => {
  const defaults = { vignette: 40, grain: 12, scanlines: 0, glow: 35 };
  const presets = { clean: { vignette: 0, grain: 0, scanlines: 0, glow: 0 }, cinematic: defaults, crt: { vignette: 55, grain: 20, scanlines: 35, glow: 65 } };
  let settings = { ...defaults };
  try {
    const saved = JSON.parse(localStorage.getItem('defusal-post-processing'));
    for (const key of Object.keys(defaults)) if (typeof saved?.[key] === 'number' && Number.isFinite(saved[key])) settings[key] = Math.min(100, Math.max(0, saved[key]));
  } catch {}
  Object.assign(translations, {
    'Visual settings': '视觉设置', 'Post-processing': '后期处理', 'Clean': '清晰', 'Cinematic': '电影', 'CRT monitor': 'CRT 显示器',
    'Vignette': '暗角', 'Film grain': '胶片颗粒', 'Scanlines': '扫描线', 'Display glow': '显示屏辉光',
    'Preview changes on the bomb. Your settings are saved automatically.': '在炸弹上预览效果。设置会自动保存。',
    'Filters are paused while Effects is off.': '视觉效果关闭时，滤镜暂停。'
  });
  const panel = document.createElement('section');
  panel.className = 'mission-panel post-settings';
  panel.innerHTML = '<details><summary>Visual settings</summary><p>Preview changes on the bomb. Your settings are saved automatically.</p><div class="post-presets" role="group" aria-label="Post-processing">' + [['clean','Clean'],['cinematic','Cinematic'],['crt','CRT monitor']].map(([id,label]) => `<button type="button" data-preset="${id}">${label}</button>`).join('') + '</div>' + Object.entries({vignette:'Vignette',grain:'Film grain',scanlines:'Scanlines',glow:'Display glow'}).map(([key,label]) => `<label class="post-setting" for="post-${key}"><span>${label}</span><output for="post-${key}" id="post-${key}-value"></output><input id="post-${key}" data-filter="${key}" type="range" min="0" max="100" step="1"></label>`).join('') + '<p class="post-paused">Filters are paused while Effects is off.</p></details>';
  document.querySelector('.sidebar').append(panel);
  const overlay = document.createElement('div');
  overlay.className = 'post-overlay';
  overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML = '<i class="post-vignette"></i><i class="post-grain"></i><i class="post-scanlines"></i>';
  document.querySelector('.bomb-station').append(overlay);
  function renderSettings() {
    for (const [key,value] of Object.entries(settings)) {
      document.documentElement.style.setProperty('--post-'+key, String(value / 100));
      panel.querySelector('#post-'+key).value = value;
      panel.querySelector('#post-'+key+'-value').textContent = value+'%';
    }
    panel.querySelectorAll('[data-preset]').forEach(button => button.setAttribute('aria-pressed',String(Object.keys(defaults).every(key=>settings[key]===presets[button.dataset.preset][key]))));
    document.documentElement.style.setProperty('--post-glow-radius', (settings.glow * .3)+'px');
  }
  function save() { renderSettings(); try { localStorage.setItem('defusal-post-processing',JSON.stringify(settings)); } catch {} }
  panel.addEventListener('input',event=>{const key=event.target.dataset.filter;if(key in defaults){settings[key]=Number(event.target.value);save();}});
  panel.addEventListener('click',event=>{const button=event.target.closest('[data-preset]');if(button){settings={...presets[button.dataset.preset]};save();}});
  renderSettings();
  applyLanguage();
})();
