import { useEffect, useState } from 'react';
import fondoCama from '../assets/cama.png';
import { SLIDES } from '../constants/slides';
import SceneContainer from '../components/SceneContainer';
import Hotspot from '../components/Hotspot';
import SlideViewer from '../components/SlideViewer';

function Cama({ onVisit }) {
    const [openSlides, setOpenSlides] = useState(false);

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
            />
        </SceneContainer>
    );
}

export default Cama;
