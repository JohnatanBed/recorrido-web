import fondoHabitacion from '../assets/habitacion.png';

function Habitacion(){
    return(
        <div className="fondo-global"
        style={{
            backgroundImage: `url(${fondoHabitacion})`,
        }}>

        </div>
    );
}

export default Habitacion;
