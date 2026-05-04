import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fondoMuralInicial from '../assets/mural-tableta.png';
import fondoMuralFinal from '../assets/mural.png';
import fondoMuralLimpio from '../assets/mural-limpio.png';
import { supabase } from '../lib/supabaseClient';
import { MURAL_SECONDARY_HOTSPOTS } from '../constants/mural';

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

    const todosLosHotspotsExplorados = hotspotsExplorados.size === MURAL_SECONDARY_HOTSPOTS.length;

    useEffect(() => {
        onVisit();
    }, [onVisit]);

    useEffect(() => {
        if (fase !== 'mensaje') {
            return undefined;
        }
    }, [fase]);

    useEffect(() => {
        if (!muralLimpioActivado) {
            return undefined;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMostrarMensajeMuralLimpio(true);
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

    const cerrarMensajePrincipal = () => {
        setFase('secundarios');
    };

    const cerrarMensajeMuralLimpio = () => {
        setMostrarMensajeMuralLimpio(false);
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
                    <button
                        type="button"
                        className="mural-dialog__close"
                        onClick={cerrarMensajePrincipal}
                        aria-label="Cerrar mensaje"
                    >
                        ✕
                    </button>
                    Las palabras pesan demasiado y los pensamientos no logran irse,
                    pero hay algo en esto que hace que todo sea más fácil.
                </div>
            )}

            {fase === 'secundarios' && !muralLimpioActivado && MURAL_SECONDARY_HOTSPOTS.map((hotspot) => (
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
                    <button
                        type="button"
                        className="mural-clean-message__close"
                        onClick={cerrarMensajeMuralLimpio}
                        aria-label="Cerrar mensaje"
                    >
                        ✕
                    </button>
                    Y tú, ¿cómo sacas al mundo todo eso que llevas dentro?
                </div>
            )}

            {fase === 'secundarios' && muralLimpioActivado && !mostrarMensajeMuralLimpio && (
                <div className="mural-board">
                    <div className="mural-board__notes">
                        {cargandoNotas ? (
                            <p className="mural-board__status">Cargando notas...</p>
                        ) : notas.length === 0 ? (
                            <p className="mural-board__status">Aún no hay notas en el pizarrón.</p>
                        ) : (
                            notas.map((nota) => {
                                return (
                                <article
                                    key={nota.id}
                                    className="mural-message"
                                >
                                    <p className="mural-message__text">{nota.text}</p>
                                    <time className="mural-message__time" dateTime={nota.created_at}>
                                        {new Date(nota.created_at).toLocaleString('es-MX', {
                                            dateStyle: 'short',
                                            timeStyle: 'short',
                                        })}
                                    </time>
                                </article>
                                );
                            })
                        )}
                    </div>

                    <form className="mural-board__form" onSubmit={manejarEnvioNota}>
                        <textarea
                            className="mural-board__textarea"
                            value={nuevaNota}
                            onChange={(event) => setNuevaNota(event.target.value)}
                            placeholder="Escribe tu nota..."
                            maxLength={80}
                            rows={3}
                        />
                        <div className="mural-board__form-footer">
                            <span className="mural-board__counter">{nuevaNota.length}/80</span>
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
