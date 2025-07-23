function loadComponent(containerId, htmlPath, scriptPath = null) {
  return fetch(htmlPath)
    .then(res => res.text())
    .then(html => {
      document.getElementById(containerId).innerHTML = html;

      if (scriptPath) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = scriptPath;
        document.body.appendChild(script);
      }
    })
    .catch(err => console.error(`Error loading [${containerId}] component: ${err}`));
}

function getDeviceId() {
  let deviceId = localStorage.getItem('device_id');
  
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('device_id', deviceId);
  }

  return deviceId
}
getDeviceId()
