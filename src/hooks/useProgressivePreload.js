import { useEffect, useRef, useState } from 'react';

/**
 * Hook para precarga progresiva (baja prioridad)
 * Precarga medios en background sin bloquear la interacción
 * Útil para contenido no crítico que se mostrará después
 */
function useProgressivePreload(mediaUrls, { maxConcurrent = 2, delayStart = 500 } = {}) {
    const [loadedUrls, setLoadedUrls] = useState(new Set());
    const [failedUrls, setFailedUrls] = useState(new Set());
    const queueRef = useRef([]);
    const activeRef = useRef(0);
    const mountedRef = useRef(true);

    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!Array.isArray(mediaUrls) || mediaUrls.length === 0) return;

        const normalizedUrls = Array.from(new Set(mediaUrls.filter(Boolean)));

        // Filtrar URLs ya cargadas o fallidas
        const pendingUrls = normalizedUrls.filter(
            (url) => !loadedUrls.has(url) && !failedUrls.has(url)
        );

        if (pendingUrls.length === 0) return;

        queueRef.current = pendingUrls;

        const startTime = Date.now();
        const timer = setTimeout(() => {
            if (mountedRef.current) {
                processQueue();
            }
        }, delayStart);

        const processQueue = async () => {
            while (queueRef.current.length > 0 && mountedRef.current) {
                if (activeRef.current >= maxConcurrent) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    continue;
                }

                const url = queueRef.current.shift();
                if (!url) continue;

                activeRef.current += 1;

                try {
                    await preloadMediaProgressively(url);
                    if (mountedRef.current) {
                        setLoadedUrls((prev) => new Set([...prev, url]));
                    }
                } catch (error) {
                    if (mountedRef.current) {
                        setFailedUrls((prev) => new Set([...prev, url]));
                    }
                    console.warn(`Progressive preload failed for ${url}:`, error);
                } finally {
                    activeRef.current -= 1;
                }
            }
        };

        processQueue();

        return () => {
            clearTimeout(timer);
        };
    }, [mediaUrls, loadedUrls, failedUrls, maxConcurrent, delayStart]);

    return {
        loaded: loadedUrls.size,
        failed: failedUrls.size,
        isReady: loadedUrls.size + failedUrls.size === (mediaUrls?.length || 0),
    };
}

const preloadMediaProgressively = (src) => {
    return new Promise((resolve, reject) => {
        if (!src) {
            reject(new Error('Empty source'));
            return;
        }

        const videoExtensions = /\.(mp4|webm|ogg|mov|mkv|avi|flv)$/i;
        const audioExtensions = /\.(mp3|wav|ogg|m4a|aac|flac)$/i;

        let timeout;
        let settled = false;

        const done = (success = true) => {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);

            if (success) {
                resolve();
            } else {
                reject(new Error('Failed to preload'));
            }
        };

        // Para imágenes
        if (!videoExtensions.test(src) && !audioExtensions.test(src)) {
            const img = new Image();
            img.onload = () => done(true);
            img.onerror = () => done(false);
            img.src = src;
            timeout = setTimeout(() => done(true), 1000);
            return;
        }

        // Para videos
        if (videoExtensions.test(src)) {
            const video = document.createElement('video');
            video.oncanplay = () => done(true);
            video.onerror = () => done(false);
            video.preload = 'metadata';
            video.crossOrigin = 'anonymous';
            video.src = src;
            timeout = setTimeout(() => done(true), 2000);
            return;
        }

        // Para audios
        if (audioExtensions.test(src)) {
            const audio = document.createElement('audio');
            audio.oncanplay = () => done(true);
            audio.onerror = () => done(false);
            audio.preload = 'metadata';
            audio.crossOrigin = 'anonymous';
            audio.src = src;
            timeout = setTimeout(() => done(true), 2000);
            return;
        }

        done(true);
    });
};

export default useProgressivePreload;
