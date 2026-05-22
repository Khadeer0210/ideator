import { useEffect } from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

export function IdeatorCanvas() {
  useEffect(() => {
    // 2. RADIAL MOUSE-TRACK GLOW
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.tlui-button') as HTMLElement;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        btn.style.setProperty('--x', `${x}px`);
        btn.style.setProperty('--y', `${y}px`);
      }
    };

    // 3. LIQUID PARTICLE BURST
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // We target .tlui-button specifically for the Tldraw toolbar buttons
      // Alternatively, apply it to a generic class like .glass-btn
      const btn = target.closest('.tlui-button') as HTMLElement;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = 0; i < 15; i++) {
          const particle = document.createElement('div');
          particle.classList.add('liquid-particle');
          
          const size = Math.random() * 6 + 2;
          const angle = Math.random() * Math.PI * 2;
          const velocity = Math.random() * 30 + 15;
          
          const tx = Math.cos(angle) * velocity;
          const ty = Math.sin(angle) * velocity;
          
          particle.style.left = `${x}px`;
          particle.style.top = `${y}px`;
          particle.style.setProperty('--size', `${size}px`);
          particle.style.setProperty('--tx', `${tx}px`);
          particle.style.setProperty('--ty', `${ty}px`);
          
          btn.appendChild(particle);
          
          setTimeout(() => {
            particle.remove();
          }, 600);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: '#1c1c1e' }}>
      
      {/* Full Workspace (Canvas) */}
      <div className="w-full h-full relative">
        <Tldraw 
          licenseKey="tldraw-2026-08-30/WyJQR2k3cjNqYSIsWyIqIl0sMTYsIjIwMjYtMDgtMzAiXQ.IOwEUfeLWQbHJ5R494orXcaVqDYlGH/1V8Lry7PHPfXmdr6uMAcmUGYAn/lHHkJvqbGXEbtvnJHyRppRpc/3tg"
          onMount={(editor) => {
            editor.user.updateUserPreferences({ colorScheme: 'dark' });
          }}
          persistenceKey="ideator-canvas-main"
        />
      </div>
      {/* Global CSS Overrides for Exact Aesthetic Match */}
      <style>
        {`
          /* Core Theme Variables - Applied globally to catch portals */
          :root, body, .tl-container, .tl-theme__dark, .tl-theme__light {
            --color-background: #1c1c1e !important;
            --color-panel: #1b1c20 !important;
            --color-panel-contrast: #121216 !important;
            --color-divider: #26272e !important;
            
            --color-text-0: #fcfcfc !important;
            --color-text-1: #e5e5e5 !important;
            --color-text-2: #8a8a93 !important;
            --color-text-3: #6b6c75 !important;
            --color-icon: #e5e5e5 !important;

            --color-focus: #4b86fa !important;
            --color-selected: #4b86fa !important;

            --color-black: #ffffff !important;         
            --color-color-black: #ffffff !important;   

            border: none !important;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif !important;
          }
          
          .tl-canvas {
            background-color: transparent !important;
          }
          
          .tl-background {
            background-color: #1c1c1e !important;
            background-image: radial-gradient(circle at center, rgba(255,255,255,0.12) 1px, transparent 1px) !important;
            background-size: 24px 24px !important;
          }

          .tlui-panel, .tlui-menu, .tlui-dialog, .tlui-popover, .tlui-toast, .tlui-button-grid, .tlui-toolbar {
            background: rgba(40, 40, 45, 0.5) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border-radius: 16px !important;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
          }

          .tl-panel, .tl-menu, .tl-popover, .tl-popover-content, .tl-toolbar, .tl-keyboard-shortcuts-dialog {
            background: transparent !important;
            border-radius: 12px !important;
            box-shadow: none !important;
            border: none !important;
            color: #fcfcfc !important;
          }

          .tlui-button {
            /* 1. GLASSMORPHISM BASE */
            background: rgba(255, 255, 255, 0.05) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            /* 4. ANIMATION TONING & DEPTH */
            transition: transform 0.1s ease, background 0.3s ease, border-color 0.3s ease !important;
            position: relative !important;
            overflow: hidden !important;
          }

          .tlui-button:active {
            transform: scale(0.97) !important;
          }

          /* 2. RADIAL MOUSE-TRACK GLOW */
          .tlui-button::before {
            content: '';
            position: absolute !important;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(
              60px circle at var(--x, 50%) var(--y, 50%),
              rgba(255, 255, 255, 0.2),
              transparent 40%
            ) !important;
            opacity: 0;
            transition: opacity 0.3s ease !important;
            pointer-events: none !important;
            z-index: 1;
          }

          .tlui-button:hover::before {
            opacity: 1;
          }

          /* 3. LIQUID PARTICLE BURST */
          .liquid-particle {
            position: absolute !important;
            border-radius: 50% !important;
            background: rgba(255, 255, 255, 0.8) !important;
            pointer-events: none !important;
            transform: translate(-50%, -50%) !important;
            animation: liquid-burst 600ms cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
            z-index: 2;
          }

          @keyframes liquid-burst {
            0% {
              width: 0px;
              height: 0px;
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            100% {
              width: var(--size);
              height: var(--size);
              opacity: 0;
              transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
            }
          }

          .tl-ui-button[data-state='selected'] {
            background-color: #4b86fa !important;
            color: white !important;
            box-shadow: 0 0 15px rgba(75, 134, 250, 0.3) !important;
          }
          /* Hide Watermark */
          [data-testid^="tl-watermark"] {
            display: none !important;
          }
        `}
      </style>
    </div>
  );
}
