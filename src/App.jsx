import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Habitacion from './pages/Habitación';
import Computadora from './pages/Computadora';
import Mural from './pages/Mural';
import Cama from './pages/Cama';
import Puerta from './pages/Puerta';
import { HOTSPOTS } from './constants/hotspots';

function App() {
  const [visitedHotspots, setVisitedHotspots] = useState([]);

  const unlockedHotspotIds = HOTSPOTS.map((hotspot) => hotspot.id);

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