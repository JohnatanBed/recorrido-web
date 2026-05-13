import { useEffect, useRef, useState } from 'react';
import { CRITICAL_ASSETS, BACKGROUND_ASSETS, PRELOAD_CONFIG, getCriticalAssetUrls, getBackgroundAssetUrls } from '../constants/preloadConfig';
import useMediaPreload from './useMediaPreload';
import useProgressivePreload from './useProgressivePreload';

/**
 * Hook completo para precarga automática de todos los assets
 * Gestiona automáticamente la precarga crítica y progresiva
 * 
 * @returns {Object} Estado de la precarga
 *   - criticalReady: booleano, indica si los assets críticos están cargados
 *   - backgroundReady: booleano, indica si los assets de baja prioridad están cargados
 *   - allReady: booleano, indica si todo está cargado
 *   - progress: número entre 0 y 100 indicando el progreso total
 */
function useAutoPreload() {
  const criticalUrls = getCriticalAssetUrls();
  const backgroundUrls = getBackgroundAssetUrls();

  // Precarga de assets críticos (bloqueante)
  const criticalReady = useMediaPreload(criticalUrls, { strict: false });

  // Precarga de assets de baja prioridad (no bloqueante)
  const backgroundProgress = useProgressivePreload(backgroundUrls, {
    maxConcurrent: PRELOAD_CONFIG.maxConcurrent,
    delayStart: PRELOAD_CONFIG.delayStart,
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!criticalReady) {
      setProgress(25);
    } else if (backgroundProgress.isReady) {
      setProgress(100);
    } else if (backgroundProgress.loaded > 0) {
      const bgTotal = backgroundProgress.loaded + backgroundProgress.failed;
      const bgProgress = (bgTotal / backgroundUrls.length) * 75;
      setProgress(Math.min(100, 25 + bgProgress));
    } else {
      setProgress(25);
    }
  }, [criticalReady, backgroundProgress, backgroundUrls.length]);

  return {
    criticalReady,
    backgroundReady: backgroundProgress.isReady,
    allReady: criticalReady && backgroundProgress.isReady,
    progress,
    backgroundProgress: backgroundProgress.loaded + backgroundProgress.failed,
    backgroundTotal: backgroundUrls.length,
  };
}

export default useAutoPreload;
