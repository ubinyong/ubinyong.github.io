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

  // 키 자동 인식(이름이 달라도 동작)
  const keys = Object.keys(themeMap);
  const LIGHT = keys.find(k => /light/i.test(k)) ?? keys[0];
  const DARK  = keys.find(k => /dark/i.test(k))  ?? keys.find(k => k !== LIGHT) ?? keys[0];

  const setVarsFromTheme = (name) => {
    const theme = themeMap[name];
    if (!theme) return;
    for (const [k, v] of Object.entries(theme)) {
      html.style.setProperty(`--primary-${k}`, v);
    }
    html.setAttribute('data-theme', name === DARK ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEY, name);
    updateToggleUI(name);
  };

  const updateToggleUI = (name) => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const isDark = (name === DARK);
    btn.textContent = isDark ? '☀️' : '🌙';  // 현재가 다크면 라이트 아이콘(전환 아이콘)
    btn.title = isDark ? '라이트 테마로' : '다크 테마로';
    btn.setAttribute('aria-pressed', String(isDark));
  };

  const init = () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    const preferDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = saved ?? (preferDark ? DARK : LIGHT);

    setVarsFromTheme(initial);

    btn.addEventListener('click', () => {
      const current = localStorage.getItem(STORAGE_KEY) || initial;
      const next = (current === DARK) ? LIGHT : DARK;
      setVarsFromTheme(next);
    });
  };

  document.addEventListener('DOMContentLoaded', init);
})();

