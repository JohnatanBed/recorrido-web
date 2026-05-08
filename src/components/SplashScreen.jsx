import { useEffect, useState } from 'react';
import '../styles/components/splash.css';

export default function SplashScreen({ onEnter, buttonDelayMs = 8000 }) {
  const [src, setSrc] = useState('/disclaimer.png');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, buttonDelayMs);

    return () => clearTimeout(timer);
  }, [buttonDelayMs]);

  return (
    <div className="splash-root" role="dialog" aria-modal="true">
      <div className="splash-content">
        <img
          src={src}
          alt="Aviso"
          className="splash-image"
          onError={(e) => {
            if (e?.currentTarget?.src && e.currentTarget.src.endsWith('.png')) {
              setSrc('/disclaimer.jpg');
            }
          }}
        />

        {showButton && (
          <button
            type="button"
            className="splash-enter"
            onClick={() => {
              if (onEnter) onEnter();
            }}
            aria-label="Comprendo"
          >
            Comprendo
          </button>
        )}
      </div>
    </div>
  );
}
