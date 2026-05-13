/**
 * Configuración centralizada para precarga de assets
 * Define qué medios deben ser precargados y en qué orden
 */

// Assets críticos (se precargan inmediatamente al abrir la app)
export const CRITICAL_ASSETS = {
  // Audios
  globalAudio: '/Vivirconeso.mp3',

  // Fondos de escenas
  scenes: {
    habitacion: '/assets/habitacion.png',
    computadora: '/assets/computadora.png',
    muralInicial: '/assets/mural-tableta.png',
    muralFinal: '/assets/mural.png',
    muralLimpio: '/assets/mural-limpio.png',
    cama: '/assets/cama.png',
    puerta: '/assets/puerta.png',
    sotano: '/assets/sotano.png',
  },

  // Perfiles de personajes (sotano)
  profiles: [
    '/perfiles/alexis comleto.png',
    '/perfiles/Lopez completo.png',
    '/perfiles/Usuga completo.png',
    '/perfiles/camila completo.png',
  ],
};

// Assets de baja prioridad (se precargan en background)
export const BACKGROUND_ASSETS = {
  // Videos de slides
  slideVideos: [
    '/slides/9.mp4',
  ],

  // Audios de slides
  slideAudios: [
    '/Audio-psicologa.mp4',
  ],

  // Imágenes de slides (se pueden precargar si hay mucho tráfico)
  slideImages: [
    '/slides/1.png',
    '/slides/2.png',
    '/slides/3.png',
    '/slides/4.png',
    '/slides/5.png',
    '/slides/6.png',
    '/slides/7.png',
    '/slides/8.png',
    '/slides/10.png',
    '/slides/11.png',
    '/slides/12.png',
    '/slides/13.png',
  ],
};

// Configuración de precarga progresiva
export const PRELOAD_CONFIG = {
  // Máximo de archivos que se descargan simultáneamente
  maxConcurrent: 2,

  // Retraso antes de iniciar la precarga progresiva (permite que la app esté lista)
  delayStart: 2000,

  // Timeout para considerar un archivo como cargado
  mediaTimeout: 2000,

  // Orden de prioridad para precarga progresiva
  // (primero: videos, luego: audios, luego: imágenes)
  loadOrder: [
    'slideVideos',
    'slideAudios',
    'slideImages',
  ],
};

/**
 * Obtiene todas las URLs críticas como un array flat
 */
export const getCriticalAssetUrls = () => {
  return [
    CRITICAL_ASSETS.globalAudio,
    Object.values(CRITICAL_ASSETS.scenes),
    CRITICAL_ASSETS.profiles,
  ].flat();
};

/**
 * Obtiene todas las URLs de baja prioridad como un array flat
 */
export const getBackgroundAssetUrls = () => {
  return [
    BACKGROUND_ASSETS.slideVideos,
    BACKGROUND_ASSETS.slideAudios,
    BACKGROUND_ASSETS.slideImages,
  ].flat();
};

/**
 * Obtiene la URL crítica de un archivo
 * @param {string} type - Tipo de asset ('globalAudio', 'habitacion', etc)
 * @returns {string | string[] | null}
 */
export const getCriticalAsset = (type) => {
  const [category, name] = type.split('.');
  if (category === 'scenes') {
    return CRITICAL_ASSETS.scenes[name] || null;
  }
  if (category === 'profiles') {
    return CRITICAL_ASSETS.profiles;
  }
  return CRITICAL_ASSETS[category] || null;
};

/**
 * Verifica si una URL es crítica
 * @param {string} url
 * @returns {boolean}
 */
export const isCriticalAsset = (url) => {
  const criticalUrls = getCriticalAssetUrls();
  return criticalUrls.includes(url);
};

/**
 * Obtiene el tipo de media (video, audio, imagen)
 * @param {string} src - URL del archivo
 * @returns {'video' | 'audio' | 'image'}
 */
export const getMediaType = (src) => {
  if (!src) return 'image';

  const videoExtensions = /\.(mp4|webm|ogg|mov|mkv|avi|flv)$/i;
  const audioExtensions = /\.(mp3|wav|ogg|m4a|aac|flac)$/i;

  if (videoExtensions.test(src)) return 'video';
  if (audioExtensions.test(src)) return 'audio';
  return 'image';
};

export default {
  CRITICAL_ASSETS,
  BACKGROUND_ASSETS,
  PRELOAD_CONFIG,
  getCriticalAssetUrls,
  getBackgroundAssetUrls,
  getCriticalAsset,
  isCriticalAsset,
  getMediaType,
};
