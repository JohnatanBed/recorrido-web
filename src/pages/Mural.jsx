import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fondoMuralInicial from '../assets/mural-tableta.png';
import fondoMuralFinal from '../assets/mural.png';

const SECONDARY_HOTSPOTS = [
    {
        id: 'mural-secundario-1',
        top: '39%',
        left: '36%',
        message: 'No sé dónde me duele.',
        videoUrl: 'https://www.youtube.com/embed/GqdpZaFcETw?si=yDDyZbUfRZdX8JoT',
    },
    {
        id: 'mural-secundario-2',
        top: '30%',
        left: '51%',
        message: 'El tiempo pasa en "un instante". Cómo desearía poder recordar.',
        videoUrl: 'https://www.youtube.com/embed/WfGMYdalClU?si=o-OAB8SZw2KHunQ4',
    },
    {
        id: 'mural-secundario-3',
        top: '57%',
        left: '70%',
        message: 'Me hubiera encantado tener esa conversación con papá, pero él ya no está.',
        videoUrl: 'https://www.youtube.com/embed/paAoB5OdJFI',
    },
];

function Mural({ onVisit }) {
    const navigate = useNavigate();
    const [fase, setFase] = useState('principal');
    const [hotspotActivo, setHotspotActivo] = useState(null);
    const [mostrarVideo, setMostrarVideo] = useState(false);

    useEffect(() => {
        onVisit();
    }, [onVisit]);

    useEffect(() => {
        if (fase !== 'mensaje') {
            return undefined;
        }

        const timeoutId = setTimeout(() => {
            setFase('secundarios');
        }, 11500);

        return () => clearTimeout(timeoutId);
    }, [fase]);

    const abrirHotspotSecundario = (hotspot) => {
        setHotspotActivo(hotspot);
        setMostrarVideo(false);
    };

    const cerrarPopup = () => {
        setHotspotActivo(null);
        setMostrarVideo(false);
    };

    return (
        <div
            className="fondo-global"
            style={{
                backgroundImage: `url(${fase === 'principal' ? fondoMuralInicial : fondoMuralFinal})`
            }}>
            <button
                type="button"
                className="scene-back-button"
                onClick={() => navigate('/habitacion')}
            >
                Volver
            </button>

            {fase === 'principal' && (
                <div
                    className="hotspot-mural"
                    onClick={() => setFase('mensaje')}
                />
            )}

            {fase === 'mensaje' && (
                <div
                    className="mural-dialog"
                >
                    Las palabras pesan demasiado y los pensamientos no logran irsen,
                    pero hay algo en esto que hace que todo sea más fácil.
                </div>
            )}

            {fase === 'secundarios' && SECONDARY_HOTSPOTS.map((hotspot) => (
                <button
                    key={hotspot.id}
                    type="button"
                    className="hotspot-mural"
                    style={{ top: hotspot.top, left: hotspot.left }}
                    aria-label={hotspot.id}
                    onClick={() => abrirHotspotSecundario(hotspot)}
                />
            ))}

            {hotspotActivo && (
                <div className="mural-modal" role="dialog" aria-modal="true" aria-label="Cortometraje" onClick={cerrarPopup}>
                    <div className="mural-modal__panel" onClick={(e) => e.stopPropagation()}>
                        {!mostrarVideo ? (
                            <>
                                <p className="mural-modal__message">{hotspotActivo.message}</p>
                                <div className="mural-modal__actions">
                                    <button
                                        type="button"
                                        className="mural-modal__button"
                                        onClick={() => setMostrarVideo(true)}
                                    >
                                        Reproducir cortometraje
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="mural-modal__video">
                                <iframe
                                    src={hotspotActivo.videoUrl}
                                    title={hotspotActivo.id}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Mural;
