import { useState, useCallback } from 'react';

export function useHotspotState(initialUnlocked = []) {
    const [unlockedHotspotIds, setUnlockedHotspotIds] = useState(initialUnlocked);
    const [visitedHotspots, setVisitedHotspots] = useState([]);

    const unlockHotspot = useCallback((hotspotId) => {
        setUnlockedHotspotIds((prev) =>
            prev.includes(hotspotId) ? prev : [...prev, hotspotId]
        );
    }, []);

    const visitHotspot = useCallback((hotspotId) => {
        setVisitedHotspots((prev) =>
            prev.includes(hotspotId) ? prev : [...prev, hotspotId]
        );
    }, []);

    const visitAndUnlock = useCallback((hotspotId) => {
        unlockHotspot(hotspotId);
        visitHotspot(hotspotId);
    }, [unlockHotspot, visitHotspot]);

    return {
        unlockedHotspotIds,
        visitedHotspots,
        unlockHotspot,
        visitHotspot,
        visitAndUnlock,
    };
}
