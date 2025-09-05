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

  function applyTheme(name){
    const theme = themeMap[name];
    if(!theme) return;
    for(const [k,v] of Object.entries(theme)){
      html.style.setProperty(`--primary-${k}`, v);
    }
    const isDark = /dark/i.test(name);
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEY, name);

    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = saved || 'default-light';   // 기본은 라이트
    applyTheme(initial);

    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', function () {
        const current = localStorage.getItem(STORAGE_KEY) || initial;
        const next = /dark/i.test(current) ? 'default-light' : 'default-dark';
        applyTheme(next);
      });
    }
  });
})();

// ==== 강제 주사 + 버튼 위치 고정 ====
(function forceThemeToggleStyles() {
  function injectFinalStyles() {
    if (!document.getElementById('theme-final')) {
      const css = `
#themeToggle.theme-toggle{
  -webkit-appearance:none !important; appearance:none !important;
  background:transparent !important; border:none !important;
  padding:0 !important; line-height:0 !important;
  width:44px !important; height:44px !important;
  position:fixed !important; left:16px !important; bottom:16px !important;
  display:inline-flex !important; align-items:center !important; justify-content:center !important;
  color:#1a1a1a !important; z-index:99999 !important;
}
html[data-theme="dark"] #themeToggle.theme-toggle{ color:#faf9f6 !important; }

/* 같은 자리 겹치기 + 한쪽만 보이기(라이트=달, 다크=해) */
#themeToggle .icon{
  position:absolute !important; inset:0 !important; margin:auto !important;
  width:100% !important; height:100% !important; display:block !important;
  stroke:currentColor !important; fill:none !important; stroke-width:2 !important;
  stroke-linecap:round !important; stroke-linejoin:round !important;
  pointer-events:none !important; opacity:0 !important; visibility:hidden !important;
  transition:opacity .15s ease !important;
}
#themeToggle .icon-moon{ fill:currentColor !important; stroke:none !important; }
/* 라이트=달만 보이기 */
#themeToggle .icon-moon{ opacity:1 !important; visibility:visible !important; }
/* 다크=해만 보이기 */
html[data-theme="dark"] #themeToggle .icon-moon{ opacity:0 !important; visibility:hidden !important; }
html[data-theme="dark"] #themeToggle .icon-sun { opacity:1 !important; visibility:visible !important; }
      `.trim();
      const s = document.createElement('style');
      s.id = 'theme-final';
      s.textContent = css;
      document.head.appendChild(s);
    }
  }

  function moveButtonToBodyEnd() {
    const btn = document.getElementById('themeToggle');
    if (btn && btn.parentElement !== document.body) {
      document.body.appendChild(btn); // transform된 조상 영향 차단
    }
  }

  // DOM 준비되면 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectFinalStyles();
      moveButtonToBodyEnd();
    });
  } else {
    injectFinalStyles();
    moveButtonToBodyEnd();
  }
})();
