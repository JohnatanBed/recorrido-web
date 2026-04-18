import { useNavigate } from 'react-router-dom';
import fondoHabitacion from '../assets/habitacion.png';

function Habitacion() {

    const navigate = useNavigate();

    return (
        <div className="fondo-global"
            style={{
                backgroundImage: `url(${fondoHabitacion})`,
            }}>
            <div className='hotspot-habitacion'
                onClick={() => navigate('/puerta')}
                style={{ top: "18%", left: "53%", }}
            >
            </div>
            <div className='hotspot-habitacion'
                onClick={() => navigate('/computadora')}
                style={{ top: "51%", left: "93%", }}
            >
            </div>
            <div className='hotspot-habitacion'
                onClick={() => navigate('/mural')}
                style={{ top: "94%", left: "44%", }}
            >
            </div>
            <div className='hotspot-habitacion'
                onClick={() => navigate('/cama')}
                style={{ top: "50%", left: "23%", }}
            >
            </div>

        </div>

    );
}

export default Habitacion;
