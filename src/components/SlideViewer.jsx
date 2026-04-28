import { useEffect } from 'react';
import { useSlideViewer } from '../hooks/useSlideViewer';

function SlideViewer({ slides, isOpen, onClose }) {
    const {
        currentSlide,
        handleNextSlide,
        handlePrevSlide,
        resetSlide,
        isFirstSlide,
        isLastSlide,
    } = useSlideViewer(slides);

    useEffect(() => {
        if (isOpen) {
            resetSlide();
        }
    }, [isOpen, resetSlide]);

    if (!isOpen) return null;

    return (
        <div className="slide-viewer-modal" role="dialog" aria-modal="true">
            <div className="slide-viewer-panel">
                <button
                    type="button"
                    className="slide-viewer-close"
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    ✕
                </button>

                <button
                    type="button"
                    className="slide-viewer-nav slide-viewer-nav--left"
                    onClick={handlePrevSlide}
                    disabled={isFirstSlide}
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
                    disabled={isLastSlide}
                    aria-label="Slide siguiente"
                >
                    ›
                </button>

                <div className="slide-viewer-counter">
                    {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </div>
            </div>
        </div>
    );
}

export default SlideViewer;
