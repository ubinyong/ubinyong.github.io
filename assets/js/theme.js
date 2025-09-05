// ===== theme.js (최소/확정본) =====
const themeMap = {
  'default-light': {
    'background-color': '#faf9f6',
    'text-color': '#1a1a1a',
    'highlight-color': '#faf9f6'
  },
  'default-dark': {
    'background-color': '#1a1a1a',
    'text-color': '#faf9f6',
    'highlight-color': '#1a1a1a'
  }
};

(function () {
  const STORAGE_KEY = 'theme';
  const html = document.documentElement;

  function applyTheme(name) {
    const theme = themeMap[name];
    if (!theme) return;
    // CSS 변수 반영
    for (const [k, v] of Object.entries(theme)) {
      html.style.setProperty(`--primary-${k}`, v);
    }
    // data-theme 토글
    html.setAttribute('data-theme', /dark/i.test(name) ? 'dark' : 'light');
    // 저장
    localStorage.setItem(STORAGE_KEY, name);
  }

  function toggleTheme() {
    const current = localStorage.getItem(STORAGE_KEY) || 'default-light';
    const next = /dark/i.test(current) ? 'default-light' : 'default-dark';
    applyTheme(next);
  }

  function injectFinalStyles() {
    // 좌하단 고정 + 겹치기 + 한쪽만 보이기 (라이트=달, 다크=해)
    if (!document.getElementById('theme-final')) {
      const css = `
#themeToggle.theme-toggle{
  -webkit-appearance:none; appearance:none; background:transparent; border:none;
  padding:0; line-height:0; width:44px; height:44px;
  position:fixed; left:16px; bottom:16px; display:inline-flex; align-items:center; justify-content:center;
  color:#1a1a1a; z-index:2147483647;
}
html[data-theme="dark"] #themeToggle.theme-toggle{ color:#faf9f6; }
#themeToggle .icon{
  position:absolute; inset:0; margin:auto; width:100%; height:100%; display:block;
  stroke:currentColor; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round;
  pointer-events:none; opacity:0; visibility:hidden; transition:opacity .15s ease;
}
#themeToggle .icon-moon{ fill:currentColor; stroke:none; }
#themeToggle .icon-moon{ opacity:1; visibility:visible; }                          /* light: 달 보임 */
html[data-theme="dark"] #themeToggle .icon-moon{ opacity:0; visibility:hidden; }   /* dark : 달 숨김 */
html[data-theme="dark"] #themeToggle .icon-sun { opacity:1; visibility:visible; }  /* dark : 해 보임 */
      `.trim();
      const s = document.createElement('style');
      s.id = 'theme-final';
      s.textContent = css;
      document.head.appendChild(s);
    }
  }

  function moveButtonToBody() {
    const btn = document.getElementById('themeToggle');
    if (btn && btn.parentElement !== document.body) {
      document.body.appendChild(btn); // transform 조상 영향 회피
    }
  }

  function bindClick() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    if (btn.__themeBound) btn.removeEventListener('click', btn.__themeBound);
    const handler = () => {
      try { toggleTheme(); } catch (e) { console.error(e); }
    };
    btn.addEventListener('click', handler);
    btn.__themeBound = handler;
  }

  // 초기 적용
  function init() {
    injectFinalStyles();
    moveButtonToBody();

    const saved = localStorage.getItem(STORAGE_KEY) || 'default-light';
    applyTheme(saved);
    bindClick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
