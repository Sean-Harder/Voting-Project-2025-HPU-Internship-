const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;


if (localStorage.getItem('theme') === 'dark-mode') {
    body.classList.replace('light-mode', 'dark-mode');
    toggleBtn.textContent = '☀️';
}


toggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');
    
    const isDark = body.classList.contains('dark-mode');
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark-mode' : 'light-mode');
});