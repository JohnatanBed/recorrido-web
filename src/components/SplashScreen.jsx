import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/splash.css';

export default function SplashScreen({ onEnter, buttonDelayMs = 8000 }) {
  const slides = ['/disclaimer.png', '/recomendacion.png', '/carta.png'];
  const [index, setIndex] = useState(0);
  const [showButton, setShowButton] = useState(true);

  const navigate = useNavigate();

  const handleContinue = () => {
    if (index < slides.length - 1) {
      setIndex((i) => i + 1);
    } else {
      navigate('/', { replace: true });
      if (onEnter) onEnter();
    }
  };

  return (
    <div className="splash-root" role="dialog" aria-modal="true">
      <div className="splash-content">
        <img
          src={slides[index]}
          alt={`Pantalla ${index + 1}`}
          className="splash-image"
          onError={(e) => {
            const src = e?.currentTarget?.src;
            if (src && src.endsWith('.png')) {
              e.currentTarget.src = src.replace('.png', '.jpg');
            }
          }}
        />

        {showButton && (
          <button
            type="button"
            className="splash-enter"
            onClick={handleContinue}
            aria-label={index < slides.length - 1 ? 'Continuar' : 'Ir al inicio'}
          >
            {index === 0
              ? 'Revela mi mundo interior'
              : index === 1
                ? 'Todo en orden'
                : 'Empecemos'}
          </button>
        )}
      </div>
    </div>
  );
}
