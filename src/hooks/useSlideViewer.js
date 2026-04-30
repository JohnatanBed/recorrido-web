import { useState, useCallback } from 'react';

export function useSlideViewer(slides) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNextSlide = useCallback(() => {
        setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
    }, [slides.length]);

    const handlePrevSlide = useCallback(() => {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
    }, []);

    const resetSlide = useCallback(() => {
        setCurrentSlide(0);
    }, []);

    return {
        currentSlide,
        handleNextSlide,
        handlePrevSlide,
        resetSlide,
        isFirstSlide: currentSlide === 0,
        isLastSlide: currentSlide === slides.length - 1,
    };
}
