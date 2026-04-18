import fondoMural from '../assets/mural.png';

function Mural(){
    return(
        <div
            className="fondo-global"
            style={{
                backgroundImage: `url(${fondoMural})`
            }}>

        </div>
    );
}

export default Mural;
