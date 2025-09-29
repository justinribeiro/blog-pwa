/**
 * I still really dig this API
 * https://developer.mozilla.org/en-US/docs/Web/API/AmbientLightSensor
 */
function setupAmbientLightThemeSwitching() {
  navigator.permissions.query({ name: 'ambient-light-sensor' }).then(result => {
    if (result.state === 'denied') {
      return;
    }
    const sensor = new AmbientLightSensor({ frequency: 0.25 });
    sensor.addEventListener('reading', () => {
      const cHtml = document.querySelector(':root');
      if (sensor.illuminance < 3) {
        cHtml.setAttribute('darkmode', '');
      } else if (sensor.illuminance > 3) {
        cHtml.removeAttribute('darkmode');
      }
    });
    sensor.start();
  });
}

export { setupAmbientLightThemeSwitching };
