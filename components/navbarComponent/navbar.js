const currentPage = window.location.pathname.split('/').pop();
console.log('current page: ', currentPage);

// Remove the settingsActive class first just in case
const settingsLink = document.getElementById('settings');
settingsLink.classList.remove('settingsActive');

// Remove active-tab from all nav tabs
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.classList.remove('active-tab');
});

if (currentPage === 'settingpage.html') {
  // Add settingsActive class to the settings link
  settingsLink.classList.add('settingsActive');
} else {
  // Add active-tab class to the matching nav tab
  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (tab.getAttribute('href') === currentPage) {
      tab.classList.add('active-tab');
    }
  });
}
