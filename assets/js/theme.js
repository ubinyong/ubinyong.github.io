// 테마 맵
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

(() => {
  const STORAGE_KEY = 'theme';
  const html = document.documentElement;

  // 키 자동 인식 (키 이름 달라도 동작)
  const keys = Object.keys(themeMap);
  const LIGHT = keys.find(k => /light/i.test(k)) ?? keys[0];
  const DARK  = keys.find(k => /dark/i.test(k))  ?? (keys.find(k => k !== LIGHT) || keys[0]);

  const setThemeVars = (name) => {
    const theme = themeMap[name];
    if (!theme) return;

    // CSS 변수 갱신
    for (const [k, v] of Object.entries(theme)) {
      html.style.setProperty(`--primary-${k}`, v);
    }

    // data-theme 부여 (아이콘 토글 + CSS 변수 스위치)
    const isDark = /dark/i.test(name);
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');

    localStorage.setItem(STORAGE_KEY, name);
    updateToggleA11y(name);
  };

  const updateToggleA11y = (name) => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const isDark = /dark/i.test(name);
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    // 아이콘 자체는 CSS가 data-theme로 스위칭 (JS에서 텍스트 안 바꿈)
  };

  const init = () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    // 항상 SVG를 주입해 아이콘이 이모지/텍스트로 남지 않게
    btn.innerHTML = `
      <!-- Sun (light) -->
      <svg class="icon icon-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
      </svg>
      <!-- Moon (dark) -->
      <svg class="icon icon-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    `;

    // 저장값 → 시스템 선호도 → 라이트
    const preferDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = saved ?? (preferDark ? DARK : LIGHT);

    setThemeVars(initial);

    btn.addEventListener('click', () => {
      const current = localStorage.getItem(STORAGE_KEY) || initial;
      const next = /dark/i.test(current) ? LIGHT : DARK;
      setThemeVars(next);
    });
  };

  document.addEventListener('DOMContentLoaded', init);
})();
