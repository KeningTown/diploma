// Загрузка OpenCV
export function loadOpenCV(): Promise<void> {
  const scriptElement = document.createElement('script');
  scriptElement.src = '/opencv.js';
  scriptElement.type = 'text/javascript';
  document.body.appendChild(scriptElement);

  return new Promise((resolve, _) => {
    const checkInterval = setInterval(() => {
      if (window.cv?.Mat) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 1000);

    window.cv = window.cv || {};
    window.cv.onRuntimeInitialized = () => {
      clearInterval(checkInterval);
      resolve();
    };
  });
}
