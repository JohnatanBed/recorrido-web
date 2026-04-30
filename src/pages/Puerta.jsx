import { useEffect } from 'react';
import fondoPuerta from '../assets/puerta.png';
import SceneContainer from '../components/SceneContainer';

function Puerta({ onVisit }) {
    useEffect(() => {
        onVisit();
    }, [onVisit]);

    return (
        <SceneContainer backgroundImage={fondoPuerta} />
    );
}

export default Puerta;
