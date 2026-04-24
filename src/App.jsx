import { useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Habitacion from './pages/Habitación';
import Computadora from './pages/Computadora';
import Mural from './pages/Mural';
import Cama from './pages/Cama';
import Puerta from './pages/Puerta';

const HOTSPOTS = [
  { id: 'computadora', route: '/computadora', top: '51%', left: '93%' },
  { id: 'mural', route: '/mural', top: '94%', left: '44%' },
  { id: 'cama', route: '/cama', top: '50%', left: '23%' },
  { id: 'puerta', route: '/puerta', top: '18%', left: '53%' },
];

function App() {
  const [visitedHotspots, setVisitedHotspots] = useState([]);

  const unlockedHotspotIds = useMemo(() => {
    let maxUnlockedIndex = 0;

    while (
      maxUnlockedIndex < HOTSPOTS.length - 1 &&
      visitedHotspots.includes(HOTSPOTS[maxUnlockedIndex].id)
    ) {
      maxUnlockedIndex += 1;
    }

    const unlockedHotspots = new Set(
      HOTSPOTS.slice(0, maxUnlockedIndex + 1).map((hotspot) => hotspot.id)
    );

    visitedHotspots.forEach((hotspotId) => {
      unlockedHotspots.add(hotspotId);
    });

    return Array.from(unlockedHotspots);
  }, [visitedHotspots]);

  const handleVisitHotspot = (hotspotId) => {
    setVisitedHotspots((previousVisited) => {
      if (previousVisited.includes(hotspotId)) {
        return previousVisited;
      }

      return [...previousVisited, hotspotId];
    });
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
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
        element={<Computadora onVisit={() => handleVisitHotspot('computadora')} />}
      />
      <Route path="/mural" element={<Mural onVisit={() => handleVisitHotspot('mural')} />} />
      <Route path="/cama" element={<Cama onVisit={() => handleVisitHotspot('cama')} />} />
      <Route
        path="/puerta"
        element={<Puerta onVisit={() => handleVisitHotspot('puerta')} />}
      />
    </Routes>
  );
};

export default App;