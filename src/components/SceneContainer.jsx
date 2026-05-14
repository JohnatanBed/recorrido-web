import { memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


function SceneContainer({
    backgroundImage,
    children,
    onBackClick = null,
    className = '',
    showBack = undefined,
    showMenu = false,
    menuLabel = 'Menú principal',
    menuClassName = '',
    menuContent = 'Menú principal',
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname } = location;

    const handleBack = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            navigate('/habitacion');
        }
    };

    const shouldShowBack = typeof showBack === 'boolean' ? showBack : pathname !== '/habitacion';

    return (
        <div
            className={`fondo-global ${className}`}
            key={pathname}
        >
            {backgroundImage && (
                <img
                    src={backgroundImage}
                    alt="Scene background"
                    className="fondo-global__image"
                    draggable={false}
                    loading="eager"
                />
            )}

            {shouldShowBack && (
                <button
                    type="button"
                    className="scene-back-button"
                    onClick={handleBack}
                >
                    Habitación
                </button>
            )}

            {showMenu && (
                <button
                    type="button"
                    className={`scene-menu-button ${menuClassName}`.trim()}
                    onClick={() => navigate('/')}
                    aria-label={menuLabel}
                >
                    {menuContent}
                </button>
            )}

            {children}
        </div>
    );
}

export default memo(SceneContainer);
