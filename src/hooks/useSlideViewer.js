import { useState } from 'react';

export function useSlideViewer(slides) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNextSlide = () => {
        setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
    };

    const resetSlide = () => {
        setCurrentSlide(0);
    };

    return {
        currentSlide,
        handleNextSlide,
        handlePrevSlide,
        resetSlide,
        isFirstSlide: currentSlide === 0,
        isLastSlide: currentSlide === slides.length - 1,
    };
}
