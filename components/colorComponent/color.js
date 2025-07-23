// Cookie helpers
function setCookie(name, value, days) {
  const expires = days
    ? '; expires=' + new Date(Date.now() + days * 864e5).toUTCString()
    : '';
  document.cookie = name + '=' + (value ?? '') + expires + '; path=/';
}

function getCookie(name) {
  const nameEQ = name + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cArray = decodedCookie.split(';');
  for (let i = 0; i < cArray.length; i++) {
    let c = cArray[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
  }
  return null;
}

function applyTheme() {
  const themeLink = document.getElementById('theme-style');
  if (!themeLink) {
    console.warn('theme-style link element not found');
    return;
  }

  let savedTheme = localStorage.getItem('theme');

  // fallback to cookie
  if (!savedTheme) {
    const cookieTheme = getCookie('themeMode');
    if (cookieTheme) {
      savedTheme = cookieTheme;
      localStorage.setItem('theme', cookieTheme);
    }
  }

  let themeToApply;
  if (savedTheme === 'light' || savedTheme === 'dark') {
    themeToApply = savedTheme;
  } else {
    themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  themeLink.href = `/components/colorComponent/${themeToApply}.css`;
  console.log('Theme applied:', themeToApply);

  updateActiveButton();
}

function switchToLight() {
  console.log('Light Toggled');
  localStorage.setItem('theme', 'light');
  setCookie('themeMode', 'light', 7);
  applyTheme();
}

function switchToDark() {
  console.log('Dark Toggled');
  localStorage.setItem('theme', 'dark');
  setCookie('themeMode', 'dark', 7);
  applyTheme();
}

function switchToSystem() {
  console.log('System Toggled');
  localStorage.setItem('theme', 'system');
  setCookie('themeMode', 'system', 7);
  applyTheme();
}

function updateActiveButton() {
  const theme = localStorage.getItem('theme');
  const buttons = {
    light: document.getElementById('lightBtn'),
    dark: document.getElementById('darkBtn'),
    system: document.getElementById('systemBtn'),
  };

  Object.entries(buttons).forEach(([key, btn]) => {
    if (!btn) return;
    if (key === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Listen for system preference changes and update theme if in system mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (localStorage.getItem('theme') === 'system') {
    applyTheme();
  }
});

// window.addEventListener('DOMContentLoaded', () => {
  applyTheme();

  const lightBtn = document.getElementById('lightBtn');
  const darkBtn = document.getElementById('darkBtn');
  const systemBtn = document.getElementById('systemBtn');

  if (lightBtn) lightBtn.addEventListener('click', switchToLight);
  if (darkBtn) darkBtn.addEventListener('click', switchToDark);
  if (systemBtn) systemBtn.addEventListener('click', switchToSystem);
// });