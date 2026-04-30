import { useEffect, useMemo, useState } from 'react';

const preloadImage = (src) => {
    return new Promise((resolve) => {
        const image = new Image();
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
};

function useImagePreload(imageUrls) {
    const [isReady, setIsReady] = useState(false);
    const uniqueUrls = useMemo(() => [...new Set(imageUrls.filter(Boolean))], [imageUrls]);

    useEffect(() => {
        let isMounted = true;

        if (uniqueUrls.length === 0) {
            setIsReady(true);
            return undefined;
        }

        setIsReady(false);

        Promise.all(uniqueUrls.map((url) => preloadImage(url))).finally(() => {
            if (isMounted) {
                setIsReady(true);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [uniqueUrls]);

    return isReady;
}

export default useImagePreload;