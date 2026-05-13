import { useEffect, useMemo, useState } from 'react';

const preloadImage = (src) => {
    return new Promise((resolve) => {
        const image = new Image();
        let settled = false;

        const done = () => {
            if (settled) return;
            settled = true;
            resolve();
        };

        image.onload = () => {
            if (typeof image.decode === 'function') {
                image.decode().catch(() => undefined).finally(done);
                return;
            }
            done();
        };

        image.onerror = done;
        image.src = src;

        if (image.complete) {
            done();
        }
    });
};

const preloadVideo = (src) => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        let settled = false;

        const done = () => {
            if (settled) return;
            settled = true;
            resolve();
        };

        const handleCanPlay = () => {
            done();
        };

        const handleError = () => {
            done();
        };

        video.addEventListener('canplay', handleCanPlay, { once: true });
        video.addEventListener('error', handleError, { once: true });
        video.preload = 'auto';
        video.src = src;

        // Si el video ya está en caché, el evento puede no dispararse
        setTimeout(done, 100);
    });
};

const preloadAudio = (src) => {
    return new Promise((resolve) => {
        const audio = document.createElement('audio');
        let settled = false;

        const done = () => {
            if (settled) return;
            settled = true;
            resolve();
        };

        const handleCanPlay = () => {
            done();
        };

        const handleError = () => {
            done();
        };

        audio.addEventListener('canplay', handleCanPlay, { once: true });
        audio.addEventListener('error', handleError, { once: true });
        audio.preload = 'auto';
        audio.src = src;

        setTimeout(done, 100);
    });
};

const getMediaType = (src) => {
    if (!src) return 'unknown';
    
    const videoExtensions = /\.(mp4|webm|ogg|mov|mkv|avi|flv)$/i;
    const audioExtensions = /\.(mp3|wav|ogg|m4a|aac|flac)$/i;
    
    if (videoExtensions.test(src)) return 'video';
    if (audioExtensions.test(src)) return 'audio';
    return 'image';
};

const preloadMedia = (src) => {
    const type = getMediaType(src);
    
    switch (type) {
        case 'video':
            return preloadVideo(src);
        case 'audio':
            return preloadAudio(src);
        default:
            return preloadImage(src);
    }
};

/**
 * Hook para precarga de medios (imágenes, videos, audios)
 * @param {string | string[]} mediaUrls - URL(s) a precargar
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.strict - Si true, espera que todos carguen. Si false, continúa aunque alguno falle
 * @returns {boolean} true cuando la precarga está completa
 */
function useMediaPreload(mediaUrls, { strict = false } = {}) {
    const normalizedUrls = useMemo(() => {
        const urls = Array.isArray(mediaUrls) ? mediaUrls : [mediaUrls];
        return urls.filter(Boolean);
    }, [mediaUrls]);

    const [isReady, setIsReady] = useState(() => normalizedUrls.length === 0);
    const uniqueUrls = useMemo(() => [...new Set(normalizedUrls)], [normalizedUrls]);

    useEffect(() => {
        let isMounted = true;

        if (uniqueUrls.length === 0) {
            setIsReady(true);
            return undefined;
        }

        const preloadPromises = uniqueUrls.map((url) =>
            preloadMedia(url).catch((error) => {
                if (strict) {
                    throw error;
                }
                // En modo no-strict, continuamos incluso si falla
                console.warn(`Failed to preload media: ${url}`, error);
            })
        );

        Promise.all(preloadPromises)
            .then(() => {
                if (isMounted) {
                    setIsReady(true);
                }
            })
            .catch((error) => {
                if (isMounted) {
                    console.error('Critical preload failure:', error);
                    // Aun en caso de error crítico, marcamos como listo después de timeout
                    setTimeout(() => {
                        if (isMounted) {
                            setIsReady(true);
                        }
                    }, 2000);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [uniqueUrls, strict]);

    return isReady;
}

export default useMediaPreload;
