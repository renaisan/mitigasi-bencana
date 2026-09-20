export function triggerConfetti() {
  if (typeof document === 'undefined') return;

  const layer = document.createElement('div');
  layer.className = 'confetti-layer';
  layer.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden;';
  document.body.appendChild(layer);

  const colors = ['#2F6FED', '#17A868', '#FF8A00', '#E14B4B', '#FFD700', '#9B59B6', '#FF6B9D', '#00D2D3'];
  const piecesCount = 65;

  for (let i = 0; i < piecesCount; i++) {
    const p = document.createElement('div');
    const width = 6 + Math.random() * 8;
    const height = 10 + Math.random() * 12;
    const duration = 2.2 + Math.random() * 2.2;
    const delay = Math.random() * 0.8;
    const rot = 360 + Math.random() * 720;
    const startX = Math.random() * 100;

    p.style.cssText = `
      position: absolute;
      top: -24px;
      left: ${startX}vw;
      width: ${width}px;
      height: ${height}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      opacity: 1;
      transform: translateY(0) rotate(0);
      transition: transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s, opacity ${duration}s ease-in ${delay}s;
    `;

    layer.appendChild(p);

    // Trigger animation via RAF
    requestAnimationFrame(() => {
      p.style.transform = `translateY(108vh) rotate(${rot}deg) scale(0.6)`;
      p.style.opacity = '0';
    });
  }

  setTimeout(() => {
    layer.remove();
  }, 5200);
}
