import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Habitacion from './pages/Habitación';
import Computadora from './pages/Computadora';
import Mural from './pages/Mural';
import Cama from './pages/Cama';
import Puerta from './pages/Puerta';
import Sotano from './pages/Sotano';
import { HOTSPOTS } from './constants/hotspots';
import { SLIDES } from './constants/slides';
import useImagePreload from './hooks/useImagePreload';
import { preloadAssets } from './lib/preloadAssets';
import fondoHabitacion from './assets/habitacion.png';
import fondoComputadora from './assets/computadora.png';
import fondoMuralInicial from './assets/mural-tableta.png';
import fondoMuralFinal from './assets/mural.png';
import fondoMuralLimpio from './assets/mural-limpio.png';
import fondoCama from './assets/cama.png';
import fondoPuerta from './assets/puerta.png';
import fondoSotano from './assets/sotano.png';
import SplashScreen from './components/SplashScreen';

const SPLASH_IMAGES = ['/recomendacion.png', '/disclaimer.png', '/carta.png'];
const CLICK_ICON_SRC = '/click.png';
const GLOBAL_AUDIO_SRC = '/Vivirconeso.mp3';
const IMAGE_EXT_RE = /\.(png|jpe?g|webp|gif|avif)$/i;
const VIDEO_EXT_RE = /\.(mp4|webm|ogg|mov)$/i;

const profileImages = [
  '/perfiles/alexis comleto.png',
  '/perfiles/Lopez completo.png',
  '/perfiles/Usuga completo.png',
  '/perfiles/camila completo.png',
];

function App() {
  const [visitedHotspots, setVisitedHotspots] = useState([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);
  const location = useLocation();
  const slideAssets = useMemo(() => {
    const images = [];
    const videos = [];
    const audios = [];

    SLIDES.forEach((slide) => {
      if (typeof slide === 'string') {
        if (VIDEO_EXT_RE.test(slide)) {
          videos.push(slide);
        } else if (IMAGE_EXT_RE.test(slide)) {
          images.push(slide);
        }
        return;
      }

      if (slide?.src) {
        if (VIDEO_EXT_RE.test(slide.src)) {
          videos.push(slide.src);
        } else if (IMAGE_EXT_RE.test(slide.src)) {
          images.push(slide.src);
        }
      }

      if (slide?.audioSrc) {
        audios.push(slide.audioSrc);
      }
    });

    return {
      images: [...new Set(images)],
      videos: [...new Set(videos)],
      audios: [...new Set(audios)],
    };
  }, []);
  const criticalSceneAssets = useMemo(
    () => [
      fondoHabitacion,
      fondoComputadora,
      fondoMuralInicial,
      fondoMuralFinal,
      fondoMuralLimpio,
      fondoCama,
      fondoPuerta,
      fondoSotano,
      ...profileImages,
    ],
    []
  );
  const isAssetsReady = useImagePreload(criticalSceneAssets);

  const canEnterDoor = ['computadora', 'mural', 'cama'].every((hotspotId) =>
    visitedHotspots.includes(hotspotId)
  );
  const unlockedHotspotIds = HOTSPOTS.map((hotspot) =>
    hotspot.id === 'puerta' ? (canEnterDoor ? hotspot.id : null) : hotspot.id
  ).filter(Boolean);
  const showAudioToggle = !['/', '/sotano'].includes(location.pathname);

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    preloadAssets(
      {
        images: [...SPLASH_IMAGES, CLICK_ICON_SRC],
        audios: [GLOBAL_AUDIO_SRC],
      },
      { strategy: 'immediate', concurrency: 3 }
    );
  }, []);

  useEffect(() => {
    if (!isAssetsReady) {
      return;
    }

    preloadAssets(
      {
        images: slideAssets.images,
        videos: slideAssets.videos,
        audios: slideAssets.audios,
      },
      { strategy: 'idle', concurrency: 2 }
    );
  }, [isAssetsReady, slideAssets]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return undefined;
    }

    const handlePlay = () => setIsAudioPlaying(true);
    const handlePause = () => setIsAudioPlaying(false);

    audio.muted = isAudioMuted;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.75;
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handlePause);
    };
  }, [isAudioMuted]);

  const playGlobalAudio = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.muted = isAudioMuted;

    try {
      await audio.play();
    } catch {
      // The browser may still block playback until it sees a user gesture.
    }
  }, [isAudioMuted]);

  const handleToggleAudio = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    audio.muted = nextMuted;

    if (!nextMuted && audio.paused) {
      try {
        await audio.play();
      } catch {
        // The browser may still block playback until it sees a user gesture.
      }
    }
  }, [isAudioMuted]);

  const pauseGlobalAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
    }
  }, []);

  const resumeGlobalAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (audio && audio.paused && !isAudioMuted) {
      try {
        await audio.play();
      } catch {
        // The browser may still block playback until it sees a user gesture.
      }
    }
  }, [isAudioMuted]);

  const handleVisitHotspot = (hotspotId) => {
    setVisitedHotspots((previousVisited) => {
      if (previousVisited.includes(hotspotId)) {
        return previousVisited;
      }

      return [...previousVisited, hotspotId];
    });
  };

  if (showSplash) {
    return (
      <SplashScreen
        onEnter={() => {
          setShowSplash(false);
          playGlobalAudio();
        }}
      />
    );
  }

  if (!isAssetsReady) {
    return <div className="app-loader">Cargando escena...</div>;
  }

  return (
    <>
      <audio ref={audioRef} src={GLOBAL_AUDIO_SRC} hidden aria-hidden="true" />

      {showAudioToggle && (
        <button
          type="button"
          className="global-audio-toggle"
          onClick={handleToggleAudio}
          aria-pressed={!isAudioMuted}
          aria-label={isAudioMuted ? 'Activar audio global' : 'Silenciar audio global'}
        >
          <span className="global-audio-toggle__icon" aria-hidden="true">
            {isAudioMuted ? '🔇' : isAudioPlaying ? '🔊' : '▶'}
          </span>
          <span className="global-audio-toggle__text">
            {isAudioMuted ? 'Activar audio' : 'Silenciar audio'}
          </span>
        </button>
      )}

      <Routes>
        <Route path="/" element={<Home onStartJourney={playGlobalAudio} />} />
        <Route
          path="/atico"
          element={<Navigate to="/habitacion" replace />}
        />
        <Route path="/sotano" element={<Sotano />} />
        <Route
          path="/habitacion"
          element={
            <Habitacion
              hotspots={HOTSPOTS}
              unlockedHotspotIds={unlockedHotspotIds}
              visitedHotspots={visitedHotspots}
            />
          }
        />
        <Route
          path="/computadora"
          element={<Computadora onVisit={() => handleVisitHotspot('computadora')} pauseGlobalAudio={pauseGlobalAudio} resumeGlobalAudio={resumeGlobalAudio} />}
        />
        <Route path="/mural" element={<Mural onVisit={() => handleVisitHotspot('mural')} pauseGlobalAudio={pauseGlobalAudio} resumeGlobalAudio={resumeGlobalAudio} />} />
        <Route
          path="/cama"
          element={
            <Cama onVisit={() => handleVisitHotspot('cama')} onStartAudio={playGlobalAudio} pauseGlobalAudio={pauseGlobalAudio} resumeGlobalAudio={resumeGlobalAudio} />
          }
        />
        <Route
          path="/puerta"
          element={
            canEnterDoor ? (
              <Puerta onVisit={() => handleVisitHotspot('puerta')} />
            ) : (
              <Navigate to="/habitacion" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;