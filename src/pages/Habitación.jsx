import { useNavigate } from 'react-router-dom';
import fondoHabitacion from '../assets/habitacion.png';
import SceneContainer from '../components/SceneContainer';
import StateHotspot from '../components/StateHotspot';

function Habitacion({ hotspots, unlockedHotspotIds, visitedHotspots }) {
    const navigate = useNavigate();
    const unlockedSet = new Set(unlockedHotspotIds);
    const visitedSet = new Set(visitedHotspots);

    return (
        <SceneContainer 
            backgroundImage={fondoHabitacion}
            onBackClick={() => navigate('/')}
        >
            <button
                type="button"
                className="scene-menu-button"
                onClick={() => navigate('/')}
            >
                Menú Principal
            </button>
            {hotspots.map((hotspot) => (
                <StateHotspot
                    key={hotspot.id}
                    hotspot={hotspot}
                    isUnlocked={unlockedSet.has(hotspot.id)}
                    isVisited={visitedSet.has(hotspot.id)}
                />
            ))}
        </SceneContainer>
    );
}

export default Habitacion;
