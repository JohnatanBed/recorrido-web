import fondoPuerta from '../assets/puerta.png';

function Puerta () {
    return(
        <div className="fondo-global"
        style={{
            backgroundImage: `url(${fondoPuerta})`,
        }}>
            
        </div>
    );
}

export default Puerta;