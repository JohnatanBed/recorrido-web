import { useNavigate } from 'react-router-dom';
import fondoHome from '../assets/habitacion.png';

function Home({ onStartJourney }) {
    const navigate = useNavigate();

    const handleEnterJourney = async (path) => {
        if (onStartJourney) {
            await onStartJourney();
        }

        navigate(path, { replace: true });
    };

    return (
        <section className="home-screen">
            <div
                className="fondo-global fondo-global-blur home-screen__background"
                style={{ backgroundImage: `url(${fondoHome})` }}
            />

            <div className="home-screen__content">
                <h1 className="home-screen__title">APRENDA A VIVIR CON ESO</h1>
                <button
                    type="button"
                    className="home-screen__button"
                    onClick={() => handleEnterJourney('/atico')}
                >
                    Ático
                </button>
                <button
                    type="button"
                    className="home-screen__button"
                    onClick={() => handleEnterJourney('/habitacion')}
                >
                    Habitación
                </button>
                <button
                    type="button"
                    className="home-screen__button"
                    onClick={() => handleEnterJourney('/sotano')}
                >
                    Sótano
                </button>
            </div>
        </section>
    );

}

export default Home;