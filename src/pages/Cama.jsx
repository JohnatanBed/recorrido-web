import fondoCama from '../assets/cama.png';

function Cama() {
    return (
        <div
            className="fondo-global"
            style={{
                backgroundImage: `url(${fondoCama})`,
            }}
        />
    );
}

export default Cama;