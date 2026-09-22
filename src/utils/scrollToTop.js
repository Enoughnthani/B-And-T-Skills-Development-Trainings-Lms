export function scrollUp(duration = 250) {
  const start = window.scrollY;
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const ease = 1 - Math.pow(1 - progress, 3); 
    window.scrollTo(0, start * (1 - ease));

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}
