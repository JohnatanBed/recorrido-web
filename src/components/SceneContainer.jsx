import { useNavigate } from 'react-router-dom';

function SceneContainer({ backgroundImage, children, onBackClick = null }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            navigate('/habitacion');
        }
    };

    return (
        <div
            className="fondo-global"
            style={{
                backgroundImage: `url(${backgroundImage})`,
            }}
        >
            <button
                type="button"
                className="scene-back-button"
                onClick={handleBack}
            >
                Volver
            </button>
            {children}
        </div>
    );
}

export default SceneContainer;
