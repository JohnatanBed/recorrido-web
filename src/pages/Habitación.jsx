import { useNavigate } from 'react-router-dom';
import fondoHabitacion from '../assets/habitacion.png';

function Habitacion({ hotspots, unlockedHotspotIds, visitedHotspots }) {

    const navigate = useNavigate();
    const unlockedSet = new Set(unlockedHotspotIds);
    const visitedSet = new Set(visitedHotspots);

    return (
        <div className="fondo-global"
            style={{
                backgroundImage: `url(${fondoHabitacion})`,
            }}>
            <button
                type="button"
                className="scene-menu-button"
                onClick={() => navigate('/')}
            >
                Menú Principal
            </button>
            {hotspots.map((hotspot) => {
                const isUnlocked = unlockedSet.has(hotspot.id);
                const isVisited = visitedSet.has(hotspot.id);

                return (
                    <button
                        key={hotspot.id}
                        type="button"
                        className={`hotspot-habitacion ${isUnlocked ? 'hotspot-habitacion--active' : 'hotspot-habitacion--locked'} ${isVisited ? 'hotspot-habitacion--visited' : ''}`}
                        onClick={() => {
                            if (isUnlocked) {
                                navigate(hotspot.route);
                            }
                        }}
                        style={{ top: hotspot.top, left: hotspot.left }}
                        aria-label={hotspot.id}
                    />
                );
            })}

        </div>

    );
}

export default Habitacion;
