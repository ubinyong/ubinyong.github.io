// ===== theme.js (클린/확정본) =====
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

  // CSS 변수 + data-theme 동기화
  function applyTheme(name) {
    const theme = themeMap[name];
    if (!theme) return;
    for (const [k, v] of Object.entries(theme)) {
      html.style.setProperty(`--primary-${k}`, v);
    }
    html.setAttribute('data-theme', /dark/i.test(name) ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEY, name);
  }

  function toggleTheme() {
    const current = localStorage.getItem(STORAGE_KEY) || 'default-light';
    const next = /dark/i.test(current) ? 'default-light' : 'default-dark';
    applyTheme(next);
  }

  // ★ 최종 스타일 1회 주입(아이콘 24px, 같은 자리 교대표시, 좌하단 고정)
  function injectFinalStyles() {
    // 예전 주입본 제거
    document.querySelectorAll('#theme-final, #theme-final-clickfix')
      .forEach(n => n.parentNode && n.parentNode.removeChild(n));

    const css = `
#themeToggle.theme-toggle{
  -webkit-appearance:none; appearance:none; background:transparent; border:none;
  padding:0; line-height:0; width:40px; height:40px;               /* 클릭 영역 */
  position:fixed; left:16px; bottom:16px;
  display:inline-flex; align-items:center; justify-content:center;
  color:#1a1a1a; z-index:2147483647;
}
html[data-theme="dark"] #themeToggle.theme-toggle{ color:#faf9f6; }

/* 두 아이콘을 '같은 자리'에 겹치기 */
#themeToggle .icon{
  position:absolute; inset:0; margin:auto;
  width:24px; height:24px;                                        /* ← 요청: 24px */
  display:block; pointer-events:none;
  stroke:currentColor; fill:none; stroke-width:2;
  stroke-linecap:round; stroke-linejoin:round;
  opacity:0; visibility:hidden; transition:opacity .2s ease;
}
#themeToggle .icon-moon{ fill:currentColor; stroke:none; }

/* 라이트 = 달만 보이기 / 다크 = 해만 보이기 */
#themeToggle .icon-moon{ opacity:1; visibility:visible; }
html[data-theme="dark"] #themeToggle .icon-moon{ opacity:0; visibility:hidden; }
html[data-theme="dark"] #themeToggle .icon-sun { opacity:1; visibility:visible; }
    `.trim();

    const s = document.createElement('style');
    s.id = 'theme-final';
    s.textContent = css;
    document.head.appendChild(s);
  }

  // 버튼을 body로 이동(변환된 조상 영향 회피) + 클릭 핸들러 바인딩
  function mountToggleAndBind() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    if (btn.parentElement !== document.body) {
      document.body.appendChild(btn);
    }

    // 클릭 최우선 보장
    btn.style.zIndex = '2147483647';
    btn.style.pointerEvents = 'auto';
    btn.querySelectorAll('.icon').forEach(i => (i.style.pointerEvents = 'none'));

    if (btn.__themeBound) btn.removeEventListener('click', btn.__themeBound);
    const handler = () => { try { toggleTheme(); } catch(e) { console.error(e); } };
    btn.addEventListener('click', handler);
    btn.__themeBound = handler;
  }

  function init() {
    injectFinalStyles();         // ★ 스타일 한 번만 주입(24px 버전)
    mountToggleAndBind();        // ★ 버튼 위치/핸들러 확정
    document.addEventListener('click', function(e){
  const tgt = e.target.closest && e.target.closest('#themeToggle');
  if (!tgt) return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation?.();
  // 실제 토글 실행
  const STORAGE_KEY = 'theme';
  const current = localStorage.getItem(STORAGE_KEY) || 'default-light';
  const next = /dark/i.test(current) ? 'default-light' : 'default-dark';
  // 변수+data-theme 동기화
  const theme = (window.themeMap || {
    'default-light': {'background-color':'#faf9f6','text-color':'#1a1a1a','highlight-color':'#faf9f6'},
    'default-dark' : {'background-color':'#1a1a1a','text-color':'#faf9f6','highlight-color':'#1a1a1a'}
  })[next];
  for (const [k,v] of Object.entries(theme)) {
    document.documentElement.style.setProperty(`--primary-${k}`, v);
  }
  document.documentElement.setAttribute('data-theme', /dark/i.test(next) ? 'dark' : 'light');
  localStorage.setItem(STORAGE_KEY, next);
}, /* useCapture */ true);
    const saved = localStorage.getItem(STORAGE_KEY) || 'default-light';
    applyTheme(saved);           // 초기 테마 반영
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
