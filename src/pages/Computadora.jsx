import { useEffect } from 'react';
import fondoComputadora from '../assets/computadora.png';
import SceneContainer from '../components/SceneContainer';

function Computadora({ onVisit }) {
    useEffect(() => {
        onVisit();
    }, [onVisit]);

    return (
        <SceneContainer backgroundImage={fondoComputadora} />
    );
}

export default Computadora;
