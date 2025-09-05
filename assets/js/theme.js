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
  const isDark = /dark/i.test(name);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  localStorage.setItem('theme', name);
  updateToggleUI(name);
};

  const init = () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    const preferDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = saved ?? (preferDark ? DARK : LIGHT);

    setVarsFromTheme(initial);

    btn.innerHTML = `
    <svg class="icon icon-sun" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
    </svg>
    <svg class="icon icon-moon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  `;

  document.addEventListener('DOMContentLoaded', init);
})();

