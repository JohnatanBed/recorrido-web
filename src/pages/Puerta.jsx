import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fondoPuerta from '../assets/puerta.png';
import SceneContainer from '../components/SceneContainer';
import Hotspot from '../components/Hotspot';

const MENSAJES_PUERTA = [
    '¿Hay alguien ahí? Necesito salir de aquí. Necesito ayuda.',
    'Por favor, ayudame, por favor.',
];

function Puerta({ onVisit }) {
    const navigate = useNavigate();
    const [mensajeActivo, setMensajeActivo] = useState(MENSAJES_PUERTA[0]);
    const [mostrarHotspots, setMostrarHotspots] = useState(false);
    const [mensajeHotspot, setMensajeHotspot] = useState('');
    const [secuenciaIniciada, setSecuenciaIniciada] = useState(false);
    const [mostrarImagenFinal, setMostrarImagenFinal] = useState(false);
    const [mensajeSegundoHotspot, setMensajeSegundoHotspot] = useState('');
    const [invertirColores, setInvertirColores] = useState(false);

    useEffect(() => {
        onVisit();
    }, [onVisit]);

    useEffect(() => {
        if (invertirColores) {
            document.body.classList.add('puerta-invertido');
        } else {
            document.body.classList.remove('puerta-invertido');
        }

        return () => {
            document.body.classList.remove('puerta-invertido');
        };
    }, [invertirColores]);

    const cerrarMensajeInicial = () => {
        if (mensajeActivo === MENSAJES_PUERTA[0]) {
            setMensajeActivo(MENSAJES_PUERTA[1]);
            return;
        }

        setMensajeActivo('');
        setMostrarHotspots(true);
    };

    const handlePrimerHotspotClick = () => {
        if (secuenciaIniciada) {
            return;
        }

        setInvertirColores(true);
        setSecuenciaIniciada(true);
        setMensajeHotspot('Gracias.');
    };

    const cerrarMensajePrimerHotspot = () => {
        if (mensajeHotspot === 'Gracias.') {
            setMensajeHotspot('Ahora sé que no estoy sola.');
            return;
        }

        setMensajeHotspot('');
        setMostrarImagenFinal(true);
    };

    const handleSegundoHotspotClick = () => {
        setMensajeSegundoHotspot('...');
        setMostrarHotspots(false);
    };

    const cerrarMensajeSegundoHotspot = () => {
        if (mensajeSegundoHotspot === '...') {
            setMensajeSegundoHotspot('¿No entendiste el juego, verdad?');
            return;
        }

        setMensajeSegundoHotspot('');
        navigate('/');
    };

    if (mostrarImagenFinal) {
        return (
            <div className="puerta-imagen-final-wrapper">
                <button
                    type="button"
                    className="scene-menu-button"
                    onClick={() => navigate('/')}
                >
                    Menú principal
                </button>
                <img
                    className="puerta-imagen-final"
                    src="/slides/13.png"
                    alt="Pista final"
                />
            </div>
        );
    }

    return (
        <SceneContainer backgroundImage={fondoPuerta}>
            {mensajeActivo && !secuenciaIniciada && !mensajeHotspot && !mensajeSegundoHotspot && (
                <div className="puerta-mensaje-overlay">
                    <button
                        type="button"
                        className="puerta-mensaje-close"
                        onClick={cerrarMensajeInicial}
                        aria-label="Cerrar mensaje"
                    >
                        ✕
                    </button>
                    <p className="puerta-mensaje-texto">{mensajeActivo}</p>
                </div>
            )}

            {mensajeHotspot && (
                <div className="puerta-mensaje-overlay">
                    <button
                        type="button"
                        className="puerta-mensaje-close"
                        onClick={cerrarMensajePrimerHotspot}
                        aria-label="Cerrar mensaje"
                    >
                        ✕
                    </button>
                    <p className="puerta-mensaje-texto">{mensajeHotspot}</p>
                </div>
            )}

            {mensajeSegundoHotspot && (
                <div className="puerta-mensaje-overlay">
                    <button
                        type="button"
                        className="puerta-mensaje-close"
                        onClick={cerrarMensajeSegundoHotspot}
                        aria-label="Cerrar mensaje"
                    >
                        ✕
                    </button>
                    <p className="puerta-mensaje-texto">{mensajeSegundoHotspot}</p>
                </div>
            )}

            {mostrarHotspots && !secuenciaIniciada && !mostrarImagenFinal && (
                <>
                    <Hotspot
                        className="hotspot-puerta"
                        position={{ top: '50%', left: '28%' }}
                        onClick={handlePrimerHotspotClick}
                        ariaLabel="hotspot-puerta-1"
                        title="Punto de interes"
                    />
                    <Hotspot
                        className="hotspot-puerta"
                        position={{ top: '31%', left: '44%' }}
                        onClick={handleSegundoHotspotClick}
                        ariaLabel="hotspot-puerta-2"
                        title="Punto de interes"
                    />
                </>
            )}
        </SceneContainer>
    );
}

export default Puerta;
