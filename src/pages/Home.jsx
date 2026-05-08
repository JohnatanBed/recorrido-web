import { useNavigate } from 'react-router-dom';
import fondoHome from '../assets/habitacion.png';

function Home({ onStartJourney }) {
    const navigate = useNavigate();

    const handleEnterJourney = async () => {
        if (onStartJourney) {
            await onStartJourney();
        }

        navigate('/habitacion', { replace: true });
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
                    onClick={handleEnterJourney}
                >
                    Habitación
                </button>
            </div>
        </section>
    );

}

export default Home;