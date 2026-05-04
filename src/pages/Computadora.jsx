import { useEffect, useState } from 'react';
import fondoComputadora from '../assets/computadora.png';
import SceneContainer from '../components/SceneContainer';
import EmotionTest from '../components/EmotionTest';

function Computadora({ onVisit, buttonPosition = { top: '40%', left: '50.5%' } }) {
    const [showTest, setShowTest] = useState(false);

    useEffect(() => {
        onVisit();
    }, [onVisit]);

    const handleStartTest = () => {
        setShowTest(true);
    };

    const handleCloseTest = () => {
        setShowTest(false);
    };

    return (
        <>
            <SceneContainer backgroundImage={fondoComputadora}>
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
            </SceneContainer>
            {showTest && <EmotionTest onClose={handleCloseTest} initialLevel={1} />}
        </>
    );
}

export default Computadora;
