import { useEffect, useMemo, useState } from 'react';
import fondoCama from '../assets/cama.png';
import { SLIDES } from '../constants/slides';
import SceneContainer from '../components/SceneContainer';
import Hotspot from '../components/Hotspot';
import SlideViewer from '../components/SlideViewer';
import useImagePreload from '../hooks/useImagePreload';

function Cama({ onVisit, onStartAudio, pauseGlobalAudio, resumeGlobalAudio }) {
    const [openSlides, setOpenSlides] = useState(false);
    const slideImageUrls = useMemo(
        () =>
            SLIDES.map((slide) => (typeof slide === 'string' ? slide : slide.src)).filter(
                (slideSrc) => /\.(png|jpe?g|webp|gif|avif)$/i.test(slideSrc)
            ),
        []
    );
    const areSlidesReady = useImagePreload(slideImageUrls);

    useEffect(() => {
        onVisit();
    }, [onVisit]);

    return (
        <SceneContainer backgroundImage={fondoCama}>
            <Hotspot
                className="hotspot-cama"
                position={{ top: '29%', left: '53.5%' }}
                onClick={() => setOpenSlides(true)}
                ariaLabel="hotspot-cama"
                title="Revista"
            />
            <SlideViewer
                slides={SLIDES}
                isOpen={openSlides}
                onClose={() => setOpenSlides(false)}
                onStartAudio={onStartAudio}
                pauseGlobalAudio={pauseGlobalAudio}
                resumeGlobalAudio={resumeGlobalAudio}
                isReady={areSlidesReady}
            />
        </SceneContainer>
    );
}

export default Cama;
