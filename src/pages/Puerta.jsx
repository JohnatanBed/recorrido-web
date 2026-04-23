import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fondoPuerta from '../assets/puerta.png';

function Puerta ({ onVisit }) {
    const navigate = useNavigate();

    useEffect(() => {
        onVisit();
    }, [onVisit]);

    return(
        <div className="fondo-global"
        style={{
            backgroundImage: `url(${fondoPuerta})`,
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

export default Puerta;