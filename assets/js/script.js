// 예: themeMap = { light: { 'background-color':'#fff', 'text-color':'#111', 'highlight-color':'#0d6efd' }, ... }

(() => {
  const STORAGE_KEY = 'theme';
  const html = document.documentElement;

  const applyTheme = (name) => {
    const theme = themeMap?.[name];
    if (!theme) return;
    // theme의 각 키를 --primary-<key> 로 매핑해 CSS 변수에 반영
    for (const [k, v] of Object.entries(theme)) {
      html.style.setProperty(`--primary-${k}`, v);
    }
    localStorage.setItem(STORAGE_KEY, name);
  };

  const init = () => {
    const select = document.getElementById('themeSelector');
    if (!select) return; 
    // 셀렉트 옵션 자동 생성
    select.innerHTML = Object.keys(themeMap)
      .map(n => `<option value="${n}">${n.charAt(0).toUpperCase()}${n.slice(1)}</option>`)
      .join('');

    // 저장된 테마 복원(없으면 첫 번째 테마)
    const saved = localStorage.getItem(STORAGE_KEY) || Object.keys(themeMap)[0];
    select.value = saved;
    applyTheme(saved);

    // 변경 시 바로 적용
    select.addEventListener('change', () => applyTheme(select.value));
  };

  document.addEventListener('DOMContentLoaded', init);
})();
