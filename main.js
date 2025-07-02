function loadComponent(containerId, htmlPath, scriptPath = null) {
  return fetch(htmlPath)
    .then(res => res.text())
    .then(html => {
      document.getElementById(containerId).innerHTML = html;

      if (scriptPath) {
        const script = document.createElement('script');
        script.src = scriptPath;
        document.body.appendChild(script);
      }
    })
    .catch(err => console.error(`Error loading [${containerId}] component: ${err}`));
}
