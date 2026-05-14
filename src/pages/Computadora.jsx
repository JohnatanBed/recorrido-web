import { useEffect, useState } from 'react';
import fondoComputadora from '../assets/computadora.png';
import SceneContainer from '../components/SceneContainer';
import EmotionTest from '../components/EmotionTest';

function Computadora({ onVisit, pauseGlobalAudio, resumeGlobalAudio, buttonPosition = { top: '40%', left: '50.5%' } }) {
    const [showTest, setShowTest] = useState(false);
    const [showIntroModal, setShowIntroModal] = useState(true);

    useEffect(() => {
        onVisit();
    }, [onVisit]);

    useEffect(() => {
        if (showTest && pauseGlobalAudio) {
            pauseGlobalAudio();
        } else if (!showTest && resumeGlobalAudio) {
            resumeGlobalAudio();
        }
    }, [showTest, pauseGlobalAudio, resumeGlobalAudio]);

    const handleStartTest = () => {
        setShowTest(true);
    };

    const handleCloseTest = () => {
        setShowTest(false);
    };

    const handleCloseIntroModal = () => {
        setShowIntroModal(false);
    };

    return (
        <>
            <SceneContainer 
                className="fondo-global"
                backgroundImage={fondoComputadora}>
                {!showIntroModal && !showTest && (
                    <button
                        type="button"
                        className="start-test-button"
                        onClick={handleStartTest}
                        style={{
                            position: 'absolute',
                            top: buttonPosition.top,
                            left: buttonPosition.left,
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        Iniciar test
                    </button>
                )}
            </SceneContainer>
            
            {showIntroModal && !showTest && (
                <div className="emotion-test-intro-modal">
                    <div className="emotion-test-intro-content">
                        <button className="emotion-test-intro-close" onClick={handleCloseIntroModal}>
                            ✕
                        </button>
                        <p className="emotion-test-intro-text">
                            A veces el exceso de luz también ciega. Mi mente está llena de fotos veladas y recuerdos que no sé cómo revelar porque me aterra lo que digan. Pero miremos tu enfoque: ¿Qué tan nítida es la imagen que tienes de ti mismo? ¿O es que tu cámara también está rota? Pasa estos tres niveles de mi caos. Al final, desbloquearemos un fragmento de tu verdad, esa que tratas de mantener fuera de foco. ¿Te atreves a ver si eres tan consciente de tus sombras o si solo caminas a ciegas?
                        </p>
                    </div>
                </div>
            )}
            
            {showTest && <EmotionTest onClose={handleCloseTest} initialLevel={1} skipIntroModal={true} />}
        </>
    );
}

export default Computadora;
