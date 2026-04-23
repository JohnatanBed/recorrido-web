import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fondoCama from '../assets/cama.png';

function Cama({ onVisit }) {
    const navigate = useNavigate();

    useEffect(() => {
        onVisit();
    }, [onVisit]);

    return (
        <div
            className="fondo-global"
            style={{
                backgroundImage: `url(${fondoCama})`,
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

export default Cama;