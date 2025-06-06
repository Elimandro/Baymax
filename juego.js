<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Pop It - reduce ansiedad</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg-color: #ffffff;
      --text-color-body: #6b7280;
      --text-color-header: #111827;
      --container-max-width: 1200px;
      --bubble-size: 6rem;
      --bubble-spacing: 1.25rem;
      --bubble-gradient-start: #e0ebff;
      --bubble-gradient-end: #b9d1ff;
      --bubble-shadow-light: rgba(134,142,162,0.15);
      --bubble-shadow-dark: rgba(70,75,99,0.3);
      --bubble-pressed-bg: #acc8ff;
      --bubble-border-radius: 0.75rem;
      --card-bg: #f9faff;
      --card-shadow: rgba(100,116,139,0.1);
      --font-family: 'Poppins', sans-serif;
      --transition-speed: 0.35s;
      --focus-outline-color: #2563eb;
      --footer-text-color: #9ca3af;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: var(--bg-color);
      font-family: var(--font-family);
      color: var(--text-color-body);
      display: flex;
      justify-content: center;
      min-height: 100vh;
      padding: 3rem 1rem 4rem;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    .page-container {
      max-width: var(--container-max-width);
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3rem;
    }

    header {
      width: 100%;
      text-align: center;
      color: var(--text-color-header);
      user-select: text;
    }

    header h1 {
      font-weight: 700;
      font-size: clamp(3rem, 5vw, 4rem);
      margin: 0;
      letter-spacing: 0.08em;
      line-height: 1.1;
      filter: drop-shadow(0 1px 1px rgba(0,0,0,0.05));
    }

    main {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .game-card {
      background: var(--card-bg);
      border-radius: var(--bubble-border-radius);
      padding: 2rem 2rem 3rem;
      box-shadow:
        0 1rem 2rem rgba(100, 116, 139, 0.08),
        0 0 0.5rem var(--card-shadow);
      max-width: 700px;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--bubble-spacing);
    }

    button.bubble {
      --scale: 1;
      cursor: pointer;
      width: var(--bubble-size);
      height: var(--bubble-size);
      border-radius: 9999px;
      border: none;
      background: linear-gradient(145deg, var(--bubble-gradient-start), var(--bubble-gradient-end));
      box-shadow:
        0 4px 8px var(--bubble-shadow-light),
        inset 0 1px 3px rgba(255 255 255 / 0.9);
      transition:
        transform var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow var(--transition-speed),
        background-color var(--transition-speed);
      position: relative;
      outline-offset: 3px;
      transform: scale(var(--scale));
      display: flex;
      align-items: center;
      justify-content: center;
      will-change: transform, box-shadow, background-color;
      user-select: none;
    }

    button.bubble:hover:not(:disabled):not(.popped) {
      filter: brightness(1.08);
      transform: scale(1.05);
      box-shadow:
        0 14px 22px var(--bubble-shadow-dark),
        inset 0 1px 4px rgba(255 255 255 / 0.85);
      transition-duration: 0.25s;
    }

    button.bubble:active:not(.popped) {
      filter: brightness(0.92);
      transform: scale(0.92);
      box-shadow:
        inset 0 2px 6px rgba(20 60 120 / 0.3);
    }

    button.bubble:focus-visible {
      outline: 3px solid var(--focus-outline-color);
      outline-offset: 4px;
      box-shadow: 0 0 12px var(--focus-outline-color);
    }

    button.bubble.popped {
      --scale: 0.9;
      background-color: var(--bubble-pressed-bg);
      background-image: linear-gradient(145deg, #8bb7ff, #89a9ff);
      box-shadow:
        inset 0 4px 8px rgba(72 94 162 / 0.45),
        0 12px 24px rgba(50 70 130 / 0.3);
      animation: popScale 0.18s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      color: transparent;
      user-select: none;
    }

    @keyframes popScale {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(0.9);
      }
    }

    /* Accessibility text */
    .bubble-status {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      border: 0;
    }

    footer {
      width: 100%;
      max-width: var(--container-max-width);
      color: var(--footer-text-color);
      font-size: 0.875rem;
      text-align: center;
      user-select: none;
      font-weight: 500;
      margin-top: 4rem;
      letter-spacing: 0.02em;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .game-card {
        grid-template-columns: repeat(5, 1fr);
        max-width: 340px;
      }
      button.bubble {
        width: 5rem;
        height: 5rem;
      }
    }
  </style>
</head>
<body>
  <div class="page-container" role="main">
    <header>
      <h1>Pop It</h1>
    </header>

    <main>
      <section class="game-card" role="grid" aria-label="Pop It ASMR Bubble Popping Game">
      </section>
    </main>

    <footer>
      Haz click para obtener un sonido satisfactorio.
    </footer>
  </div>

  <audio id="popSound" preload="auto" src="pop-39222.mp3"></audio>
  <audio id="unpopSound" preload="auto" src="pop-39222.mp3"></audio>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const container = document.querySelector('.game-card');
      const popSound = document.getElementById('popSound');
      const unpopSound = document.getElementById('unpopSound');
      const ROWS = 5;
      const COLS = 7;
      const totalBubbles = ROWS * COLS;

      function createBubble(index) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'bubble';
        button.setAttribute('role', 'gridcell');
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('tabindex', '0');
        button.title = 'Pop bubble ' + (index + 1);
        button.dataset.index = index;

        const stateSpan = document.createElement('span');
        stateSpan.className = 'bubble-status';
        stateSpan.textContent = 'Not popped';
        button.appendChild(stateSpan);

        button.addEventListener('click', () => {
          const isPopped = button.classList.toggle('popped');
          button.setAttribute('aria-pressed', isPopped.toString());
          stateSpan.textContent = isPopped ? 'Popped' : 'Not popped';

          if (isPopped) {
            popSound.currentTime = 0;
            popSound.play();
          } else {
            unpopSound.currentTime = 0;
            unpopSound.play();
          }
        });

        button.addEventListener('keydown', (e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            button.click();
          }
        });

        return button;
      }

      for(let i = 0; i < totalBubbles; i++) {
        container.appendChild(createBubble(i));
      }
    });
  </script>
</body>
</html>

