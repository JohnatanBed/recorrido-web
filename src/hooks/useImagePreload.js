import { useEffect, useMemo, useState } from 'react';
import { preloadImage } from '../lib/preloadAssets';

function useImagePreload(imageUrls) {
    const normalizedUrls = useMemo(() => imageUrls.filter(Boolean), [imageUrls]);
    const [isReady, setIsReady] = useState(() => normalizedUrls.length === 0);
    const uniqueUrls = useMemo(() => [...new Set(normalizedUrls)], [normalizedUrls]);

    useEffect(() => {
        let isMounted = true;

        if (uniqueUrls.length === 0) {
            if (isMounted) {
                setIsReady(true);
            }
            return () => {
                isMounted = false;
            };
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