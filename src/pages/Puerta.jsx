import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fondoPuerta from '../assets/puerta.png';
import SceneContainer from '../components/SceneContainer';
import Hotspot from '../components/Hotspot';

const MENSAJES_PUERTA = [
    '¿Hay alguien ahí? Necesito salir de aquí. Necesito ayuda.',
    'Por favor, ayudame, por favor.',
];

const DURACION_MENSAJES_HOTSPOT = 5000;

function Puerta({ onVisit }) {
    const navigate = useNavigate();
    const [mensajeActivo, setMensajeActivo] = useState(MENSAJES_PUERTA[0]);
    const [mostrarHotspots, setMostrarHotspots] = useState(false);
    const [mensajeHotspot, setMensajeHotspot] = useState('');
    const [secuenciaIniciada, setSecuenciaIniciada] = useState(false);
    const [mostrarImagenFinal, setMostrarImagenFinal] = useState(false);
    const [mensajeSegundoHotspot, setMensajeSegundoHotspot] = useState('');
    const timeoutsRef = useRef([]);
    const [invertirColores, setInvertirColores] = useState(false);

    useEffect(() => {
        onVisit();
    }, [onVisit]);

    useEffect(() => {
        const primerCambio = setTimeout(() => {
            setMensajeActivo(MENSAJES_PUERTA[1]);
        }, 10000);

        const ocultarMensajes = setTimeout(() => {
            setMensajeActivo('');
            setMostrarHotspots(true);
        }, 20000);

        return () => {
            clearTimeout(primerCambio);
            clearTimeout(ocultarMensajes);
        };
    }, []);

    useEffect(() => {
        if (!secuenciaIniciada) {
            return undefined;
        }

        setMensajeHotspot('Gracias.');

        const segundoMensaje = setTimeout(() => {
            setMensajeHotspot('Ahora sé que no estoy sola.');
        }, DURACION_MENSAJES_HOTSPOT);

        const ocultarMensaje = setTimeout(() => {
            setMensajeHotspot('');
        }, DURACION_MENSAJES_HOTSPOT * 2);

        const mostrarImagen = setTimeout(() => {
            setMostrarImagenFinal(true);
        }, DURACION_MENSAJES_HOTSPOT * 2 + 500);

        return () => {
            clearTimeout(segundoMensaje);
            clearTimeout(ocultarMensaje);
            clearTimeout(mostrarImagen);
        };
    }, [secuenciaIniciada]);

    useEffect(() => {
        return () => {
            // Clear any timeouts created by segundo hotspot handler on unmount
            timeoutsRef.current.forEach((id) => clearTimeout(id));
            timeoutsRef.current = [];
        };
    }, []);

    const handlePrimerHotspotClick = () => {
        if (secuenciaIniciada) {
            return;
        }

        // invertir colores al hacer click
        setInvertirColores(true);
        setSecuenciaIniciada(true);
    };

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

    const mensajeVisible = mensajeActivo || mensajeHotspot || mensajeSegundoHotspot;

    const handleSegundoHotspotClick = () => {
        // start sequence: show '...' then next message then redirect
        setMensajeSegundoHotspot('...');
        // hide other hotspots while sequence runs
        setMostrarHotspots(false);

        const t1 = setTimeout(() => {
            setMensajeSegundoHotspot('¿No entendiste el juego, verdad?');
        }, DURACION_MENSAJES_HOTSPOT);

        const t2 = setTimeout(() => {
            setMensajeSegundoHotspot('');
            navigate('/');
        }, DURACION_MENSAJES_HOTSPOT * 2 + 200);

        timeoutsRef.current.push(t1, t2);
    };

    const mensajeVisibleFinal = mensajeVisible || mensajeSegundoHotspot;

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
            {mensajeVisible && (
                <div className="puerta-mensaje-overlay">
                    <p className="puerta-mensaje-texto">{mensajeVisible}</p>
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
