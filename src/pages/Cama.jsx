import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fondoCama from '../assets/cama.png';

function Cama({ onVisit }) {
    const navigate = useNavigate();
    const [openSlides, setOpenSlides] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        onVisit();
    }, [onVisit]);

    useEffect(() => {
        if (openSlides) {
            setCurrentSlide(0);
        }
    }, [openSlides]);

    const slides = [
        '/slides/1.png',
        '/slides/2.png',
        '/slides/3.png',
        '/slides/4.png',
        '/slides/5.png',
        '/slides/6.png',
        '/slides/7.png',
        '/slides/8.png',
        '/slides/9.png',
        '/slides/10.png',
        '/slides/11.png',
        '/slides/12.png',
    ];

    const handleNextSlide = () => {
        setCurrentSlide((previousSlide) => Math.min(slides.length - 1, previousSlide + 1));
    };

    const handlePrevSlide = () => {
        setCurrentSlide((previousSlide) => Math.max(0, previousSlide - 1));
    };

    return (
        <div
            className="fondo-global"
            style={{
                backgroundImage: `url(${fondoCama})`,
            }}
        >
            <button
                type="button"
                className="scene-back-button"
                onClick={() => navigate('/habitacion')}
            >
                Volver
            </button>
            <button
                type="button"
                className="hotspot-cama"
                onClick={() => setOpenSlides(true)}
                style={{ top: '29%', left: '53.5%' }}
                aria-label="hotspot-cama"
                title="Haz clic para ver los slides"
            />
            {openSlides && (
                <div className="slide-viewer-modal" role="dialog" aria-modal="true">
                    <div className="slide-viewer-panel">
                        <button
                            type="button"
                            className="slide-viewer-close"
                            onClick={() => setOpenSlides(false)}
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>

                        <button
                            type="button"
                            className="slide-viewer-nav slide-viewer-nav--left"
                            onClick={handlePrevSlide}
                            disabled={currentSlide === 0}
                            aria-label="Slide anterior"
                        >
                            ‹
                        </button>

                        <div className="slide-viewer-frame">
                            <img
                                src={slides[currentSlide]}
                                alt={`Slide ${currentSlide + 1}`}
                                className="slide-viewer-image"
                            />
                        </div>

                        <button
                            type="button"
                            className="slide-viewer-nav slide-viewer-nav--right"
                            onClick={handleNextSlide}
                            disabled={currentSlide === slides.length - 1}
                            aria-label="Slide siguiente"
                        >
                            ›
                        </button>

                        <div className="slide-viewer-counter">
                            {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cama;