import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fondoMural from '../assets/mural.png';

function Mural({ onVisit }){
    const navigate = useNavigate();

    useEffect(() => {
        onVisit();
    }, [onVisit]);

    return(
        <div
            className="fondo-global"
            style={{
                backgroundImage: `url(${fondoMural})`
            }}>
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

export default Mural;
