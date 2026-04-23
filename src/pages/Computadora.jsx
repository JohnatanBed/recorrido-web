import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fondoComputadora from '../assets/computadora.png';

function Computadora({ onVisit }){
    const navigate = useNavigate();

    useEffect(() => {
        onVisit();
    }, [onVisit]);

    return(
        <div className="fondo-global"
        style={{
            backgroundImage: `url(${fondoComputadora})`,
        }}
        >
            <button
                type="button"
                className="scene-back-button"
                onClick={() => navigate('/habitacion')}
            >
                Volver
            </button>
        </div>
    );
}

export default Computadora;
