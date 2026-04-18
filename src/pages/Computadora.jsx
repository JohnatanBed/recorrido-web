import fondoComputadora from '../assets/computadora.png';

function Computadora(){
    return(
        <div className="fondo-global"
        style={{
            backgroundImage: `url(${fondoComputadora})`,
        }}
        ></div>
    );
}

export default Computadora;
