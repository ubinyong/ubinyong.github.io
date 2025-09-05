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
