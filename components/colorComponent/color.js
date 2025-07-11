window.switchToLight = function () {
    document.getElementById('theme-style').href = '/components/colorComponent/light.css';
    localStorage.setItem('theme', '/components/colorComponent/light.css');
    console.log('Light mode activated');
  };
  
  window.switchToDark = function () {
    document.getElementById('theme-style').href = '/components/colorComponent/dark.css';
    localStorage.setItem('theme', '/components/colorComponent/dark.css');
    console.log('Dark mode activated');
  };
  
  // Load theme on page load (optional but recommended)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    const themeLink = document.getElementById('theme-style');
    if (themeLink) {
      themeLink.href = savedTheme;
    }
  }