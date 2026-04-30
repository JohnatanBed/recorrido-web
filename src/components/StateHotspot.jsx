import { useNavigate } from 'react-router-dom';

function StateHotspot({ 
    hotspot, 
    isUnlocked, 
    isVisited, 
    onClickLocked = null 
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (isUnlocked) {
            navigate(hotspot.route);
        } else if (onClickLocked) {
            onClickLocked();
        }
    };

    const className = `hotspot-habitacion ${
        isUnlocked ? 'hotspot-habitacion--active' : 'hotspot-habitacion--locked'
    } ${isVisited ? 'hotspot-habitacion--visited' : ''}`;

    return (
        <button
            key={hotspot.id}
            type="button"
            className={className}
            onClick={handleClick}
            style={{ top: hotspot.top, left: hotspot.left }}
            aria-label={hotspot.id}
        />
    );
}

export default StateHotspot;
