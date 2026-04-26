import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fondoMuralInicial from '../assets/mural-tableta.png';
import fondoMuralFinal from '../assets/mural.png';
import fondoMuralLimpio from '../assets/mural-limpio.png';
import { supabase } from '../lib/supabaseClient';

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
    const [hotspotsExplorados, setHotspotsExplorados] = useState(() => new Set());
    const [muralLimpioActivado, setMuralLimpioActivado] = useState(false);
    const [mostrarMensajeMuralLimpio, setMostrarMensajeMuralLimpio] = useState(false);
    const [notas, setNotas] = useState([]);
    const [nuevaNota, setNuevaNota] = useState('');
    const [cargandoNotas, setCargandoNotas] = useState(false);
    const [enviandoNota, setEnviandoNota] = useState(false);
    const [errorNotas, setErrorNotas] = useState('');

    const todosLosHotspotsExplorados = hotspotsExplorados.size === SECONDARY_HOTSPOTS.length;

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

    useEffect(() => {
        if (!muralLimpioActivado) {
            return undefined;
        }

        setMostrarMensajeMuralLimpio(true);
        const timeoutId = setTimeout(() => {
            setMostrarMensajeMuralLimpio(false);
        }, 7000);

        return () => clearTimeout(timeoutId);
    }, [muralLimpioActivado]);

    useEffect(() => {
        if (!muralLimpioActivado) {
            return undefined;
        }

        let isActive = true;

        const cargarNotas = async () => {
            setCargandoNotas(true);
            setErrorNotas('');

            const { data, error } = await supabase
                .from('mural_comments')
                .select('id, text, created_at')
                .order('created_at', { ascending: false });

            if (!isActive) {
                return;
            }

            if (error) {
                setErrorNotas('No se pudieron cargar las notas.');
                setNotas([]);
            } else {
                setNotas(data ?? []);
            }

            setCargandoNotas(false);
        };

        cargarNotas();

        return () => {
            isActive = false;
        };
    }, [muralLimpioActivado]);

    const abrirHotspotSecundario = (hotspot) => {
        setHotspotActivo(hotspot);
        setMostrarVideo(false);
        setHotspotsExplorados((prev) => {
            const next = new Set(prev);
            next.add(hotspot.id);
            return next;
        });
    };

    const cerrarPopup = () => {
        setHotspotActivo(null);
        setMostrarVideo(false);
    };

    const limpiarMural = () => {
        setMuralLimpioActivado(true);
    };

    const manejarEnvioNota = async (event) => {
        event.preventDefault();

        const texto = nuevaNota.trim();
        if (!texto || enviandoNota) {
            return;
        }

        setEnviandoNota(true);
        setErrorNotas('');

        const { data, error } = await supabase
            .from('mural_comments')
            .insert({ text: texto })
            .select('id, text, created_at')
            .single();

        if (error) {
            setErrorNotas('No se pudo guardar tu nota.');
            setEnviandoNota(false);
            return;
        }

        setNotas((previousNotas) => [data, ...previousNotas]);
        setNuevaNota('');
        setEnviandoNota(false);
    };

    return (
        <div
            className="fondo-global"
            style={{
                backgroundImage: `url(${fase === 'principal' ? fondoMuralInicial : (muralLimpioActivado ? fondoMuralLimpio : fondoMuralFinal)})`
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

            {fase === 'secundarios' && !todosLosHotspotsExplorados && SECONDARY_HOTSPOTS.map((hotspot) => (
                <button
                    key={hotspot.id}
                    type="button"
                    className="hotspot-mural"
                    style={{ top: hotspot.top, left: hotspot.left }}
                    aria-label={hotspot.id}
                    onClick={() => abrirHotspotSecundario(hotspot)}
                />
            ))}

            {fase === 'secundarios' && todosLosHotspotsExplorados && !muralLimpioActivado && (
                <button
                    type="button"
                    className="mural-clean-button"
                    onClick={limpiarMural}
                >
                    Limpiar mural
                </button>
            )}

            {fase === 'secundarios' && muralLimpioActivado && mostrarMensajeMuralLimpio && (
                <div className="mural-clean-message">
                    ¿Y tú cómo sacas al mundo todo eso que llevas dentro?
                </div>
            )}

            {fase === 'secundarios' && muralLimpioActivado && (
                <div className="mural-board">
                    <div className="mural-board__header">
                        <h2 className="mural-board__title">Pizarrón público</h2>
                        <p className="mural-board__subtitle">Deja una nota adhesiva para quien llegue después.</p>
                    </div>

                    <form className="mural-board__form" onSubmit={manejarEnvioNota}>
                        <textarea
                            className="mural-board__textarea"
                            value={nuevaNota}
                            onChange={(event) => setNuevaNota(event.target.value)}
                            placeholder="Escribe tu nota..."
                            maxLength={180}
                            rows={3}
                        />
                        <div className="mural-board__form-footer">
                            <span className="mural-board__counter">{nuevaNota.length}/180</span>
                            <button
                                type="submit"
                                className="mural-board__submit"
                                disabled={enviandoNota || nuevaNota.trim().length === 0}
                            >
                                {enviandoNota ? 'Guardando...' : 'Pegar nota'}
                            </button>
                        </div>
                    </form>

                    {errorNotas && <p className="mural-board__error">{errorNotas}</p>}

                    <div className="mural-board__notes">
                        {cargandoNotas ? (
                            <p className="mural-board__status">Cargando notas...</p>
                        ) : notas.length === 0 ? (
                            <p className="mural-board__status">Aún no hay notas en el pizarrón.</p>
                        ) : (
                            notas.map((nota, index) => (
                                <article
                                    key={nota.id}
                                    className={`mural-sticky mural-sticky--${(index % 4) + 1}`}
                                    style={{ transform: `rotate(${(index % 5) - 2}deg)` }}
                                >
                                    <p className="mural-sticky__text">{nota.text}</p>
                                    <time className="mural-sticky__time" dateTime={nota.created_at}>
                                        {new Date(nota.created_at).toLocaleString('es-MX', {
                                            dateStyle: 'short',
                                            timeStyle: 'short',
                                        })}
                                    </time>
                                </article>
                            ))
                        )}
                    </div>
                </div>
            )}

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
