const imageCache = new Map();
const audioCache = new Map();
const videoCache = new Map();

const isBrowser = typeof window !== 'undefined';

const normalizeList = (items) => {
    if (!Array.isArray(items)) {
        return [];
    }

    return [...new Set(items.filter(Boolean))];
};

const scheduleIdle = (task) => {
    if (!isBrowser) {
        task();
        return;
    }

    if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => task(), { timeout: 1500 });
        return;
    }

    setTimeout(task, 50);
};

const runWithConcurrency = async (tasks, concurrency) => {
    if (tasks.length === 0) {
        return;
    }

    const limit = Math.max(1, concurrency || 1);
    let index = 0;

    const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => {
        return (async () => {
            while (index < tasks.length) {
                const current = index;
                index += 1;
                await tasks[current]();
            }
        })();
    });

    await Promise.all(workers);
};

export const preloadImage = (src) => {
    if (!src) {
        return Promise.resolve();
    }

    const cached = imageCache.get(src);
    if (cached) {
        return cached.promise;
    }

    if (!isBrowser || typeof Image === 'undefined') {
        return Promise.resolve();
    }

    const image = new Image();
    const promise = new Promise((resolve) => {
        let settled = false;

        const done = () => {
            if (settled) {
                return;
            }

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

    imageCache.set(src, { promise, element: image });
    return promise;
};

export const preloadAudio = (src) => {
    if (!src) {
        return Promise.resolve();
    }

    const cached = audioCache.get(src);
    if (cached) {
        return cached.promise;
    }

    if (!isBrowser || typeof Audio === 'undefined') {
        return Promise.resolve();
    }

    const audio = new Audio();
    const promise = new Promise((resolve) => {
        let settled = false;

        const done = () => {
            if (settled) {
                return;
            }

            settled = true;
            resolve();
        };

        audio.preload = 'auto';
        audio.src = src;
        audio.addEventListener('canplaythrough', done, { once: true });
        audio.addEventListener('loadeddata', done, { once: true });
        audio.addEventListener('error', done, { once: true });
        audio.load();
    });

    audioCache.set(src, { promise, element: audio });
    return promise;
};

export const preloadVideo = (src) => {
    if (!src) {
        return Promise.resolve();
    }

    const cached = videoCache.get(src);
    if (cached) {
        return cached.promise;
    }

    if (!isBrowser || typeof document === 'undefined') {
        return Promise.resolve();
    }

    const video = document.createElement('video');
    const promise = new Promise((resolve) => {
        let settled = false;

        const done = () => {
            if (settled) {
                return;
            }

            settled = true;
            resolve();
        };

        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        video.src = src;
        video.addEventListener('canplaythrough', done, { once: true });
        video.addEventListener('loadeddata', done, { once: true });
        video.addEventListener('error', done, { once: true });
        video.load();
    });

    videoCache.set(src, { promise, element: video });
    return promise;
};

export const preloadAssets = (assets = {}, options = {}) => {
    const images = normalizeList(assets.images);
    const audios = normalizeList(assets.audios);
    const videos = normalizeList(assets.videos);
    const strategy = options.strategy || 'immediate';
    const concurrency = options.concurrency || 4;

    const tasks = [
        ...images.map((src) => () => preloadImage(src)),
        ...audios.map((src) => () => preloadAudio(src)),
        ...videos.map((src) => () => preloadVideo(src)),
    ];

    if (tasks.length === 0) {
        return Promise.resolve();
    }

    const run = () => runWithConcurrency(tasks, concurrency);

    if (strategy === 'idle') {
        return new Promise((resolve) => {
            scheduleIdle(() => {
                run().finally(resolve);
            });
        });
    }

    return run();
};
