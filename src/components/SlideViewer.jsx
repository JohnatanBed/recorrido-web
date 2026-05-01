import { useEffect, useRef } from 'react';
import { useSlideViewer } from '../hooks/useSlideViewer';

function SlideViewer({ slides, isOpen, onClose }) {
    const audioRef = useRef(null);
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

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [currentSlide]);

    if (!isOpen) return null;

    const currentSlideData = slides[currentSlide];
    const slideSrc = typeof currentSlideData === 'string' ? currentSlideData : currentSlideData.src;
    const slideLink = typeof currentSlideData === 'string' ? null : currentSlideData.link;
    const slideLinkText = typeof currentSlideData === 'string' ? '' : currentSlideData.linkText;
    const slideLinkClassName = typeof currentSlideData === 'string' ? '' : currentSlideData.linkClassName;
    const extraLink = typeof currentSlideData === 'string' ? '' : currentSlideData.extraLink;
    const extraText = typeof currentSlideData === 'string' ? '' : currentSlideData.extraText;
    const extraClassName = typeof currentSlideData === 'string' ? '' : currentSlideData.extraClassName;
    const audioSrc = typeof currentSlideData === 'string' ? '' : currentSlideData.audioSrc;
    const showClickIcon = typeof currentSlideData === 'string' ? false : currentSlideData.showClickIcon;

    const handleAudioPlay = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    };

    const isVideo = slideSrc && /\.(mp4|webm|ogg|mov)$/i.test(slideSrc);

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
                    {slideLink && slideLinkText ? (
                        <a
                            className={`slide-viewer-link ${slideLinkClassName || ''}`}
                            href={slideLink}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={slideLinkText}
                        >
                            <span>{slideLinkText}</span>
                            {showClickIcon && <img src="/click.png" alt="click" className="slide-viewer-click-icon" />}
                        </a>
                    ) : null}

                    {audioSrc && slideLinkText ? (
                        <button
                            type="button"
                            className={`slide-viewer-link ${slideLinkClassName || ''}`}
                            onClick={handleAudioPlay}
                            aria-label={slideLinkText}
                        >
                            <span>▶ {slideLinkText}</span>
                            {showClickIcon && <img src="/click.png" alt="click" className="slide-viewer-click-icon" />}
                        </button>
                    ) : null}

                    {extraLink && extraText ? (
                        <a
                            className={`slide-viewer-extra ${extraClassName || ''}`}
                            href={extraLink}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={extraText}
                        >
                            <span>{extraText}</span>
                            {showClickIcon && <img src="/click.png" alt="click" className="slide-viewer-click-icon-extra" />}
                        </a>
                    ) : null}
                    {isVideo ? (
                        <video
                            src={slideSrc}
                            className="slide-viewer-image"
                            autoPlay
                            loop
                        />
                    ) : (
                        <img
                            src={slideSrc}
                            alt={`Slide ${currentSlide + 1}`}
                            className="slide-viewer-image"
                        />
                    )}
                    {audioSrc && <audio ref={audioRef} src={audioSrc} />}
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
