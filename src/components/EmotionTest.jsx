import { useState, useMemo, useCallback } from 'react';
import { EMOTIONS_TEST, getRandomQuestionsForLevel } from '../constants/emotions';
import '../styles/components/emotion-test.css';

const shuffleArray = (items) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
};

function EmotionTest({ onClose, initialLevel = 1, skipIntroModal = false }) {
  const [showIntroModal, setShowIntroModal] = useState(!skipIntroModal);
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const initialShuffled = shuffleArray(getRandomQuestionsForLevel(initialLevel, 3));
  const [shuffledQuestions, setShuffledQuestions] = useState(initialShuffled);
  // Acumular preguntas de todos los niveles para calcular resultado final
  const [allAskedQuestions, setAllAskedQuestions] = useState(initialShuffled);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedDescriptions, setSelectedDescriptions] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});

  const levels = ['level1', 'level2', 'level3'];
  const currentLevelKey = levels[currentLevel - 1];
  const questions = shuffledQuestions;
  const questionData = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Seleccionar aleatoriamente una descripción de questions
  const getRandomDescription = useCallback((questionId, questionsList) => {
    if (selectedDescriptions[questionId]) {
      return selectedDescriptions[questionId];
    }
    const q = questionsList.find(qItem => qItem.id === questionId);
    if (q && q.questions && q.questions.length > 0) {
      const randomIndex = Math.floor(Math.random() * q.questions.length);
      const selectedDesc = q.questions[randomIndex];
      setSelectedDescriptions(prev => ({ ...prev, [questionId]: selectedDesc }));
      return selectedDesc;
    }
    return '';
  }, [selectedDescriptions]);

  // Obtener 4 opciones (correcta + 3 aleatorias)
  const getFilteredOptions = useCallback((questionId, allOptions, correctAnswer) => {
    if (selectedOptions[questionId]) {
      return selectedOptions[questionId];
    }
    
    // Si ya tenemos 4 o menos opciones, usarlas todas
    if (allOptions.length <= 4) {
      setSelectedOptions(prev => ({ ...prev, [questionId]: allOptions }));
      return allOptions;
    }

    // Garantizar que la respuesta correcta esté incluida
    const otherOptions = allOptions.filter(opt => opt !== correctAnswer);
    const shuffled = otherOptions.sort(() => Math.random() - 0.5);
    const threeRandom = shuffled.slice(0, 3);
    const finalOptions = [correctAnswer, ...threeRandom].sort(() => Math.random() - 0.5);
    
    setSelectedOptions(prev => ({ ...prev, [questionId]: finalOptions }));
    return finalOptions;
  }, [selectedOptions]);

  const displayDescription = getRandomDescription(questionData.id, questions);
  const displayOptions = getFilteredOptions(questionData.id, questionData.options, questionData.correctAnswer);

  const handleSelectOption = (optionValue) => {
    const newAnswers = {
      ...answers,
      [questionData.id]: optionValue,
    };
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Fin del nivel actual
      if (currentLevel < 3) {
        // Avanzar automáticamente al siguiente nivel sin mostrar resultados intermedios
        const nextLevel = currentLevel + 1;
        const newShuffled = shuffleArray(getRandomQuestionsForLevel(nextLevel, 3));

        setCurrentLevel(nextLevel);
        setShuffledQuestions(newShuffled);
        setAllAskedQuestions(prev => [...prev, ...newShuffled]);
        setCurrentQuestion(0);
      } else {
        // Último nivel completado: mostrar resultados finales
        setShowResults(true);
      }
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < 3) {
      const nextLevel = currentLevel + 1;

      const newShuffled = shuffleArray(getRandomQuestionsForLevel(nextLevel, 3));

      setCurrentLevel(nextLevel);
      setShuffledQuestions(newShuffled);
      setAllAskedQuestions(prev => [...prev, ...newShuffled]);
      setCurrentQuestion(0);
      setShowResults(false);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleCloseIntroModal = () => {
    setShowIntroModal(false);
  };

  // Calcular aciertos sobre todas las preguntas hechas en todos los niveles
  const correctAnswers = useMemo(() => {
    return allAskedQuestions.reduce((count, q) => {
      return count + (answers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);
  }, [answers, allAskedQuestions]);

  const totalAsked = allAskedQuestions.length;
  const percentage = totalAsked > 0 ? Math.round((correctAnswers / totalAsked) * 100) : 0;

  const getAchievement = (pct) => {
    if (pct <= 50) {
      return {
        name: 'Lienzo en Blanco',
        description:
          'Las personas con alexitimia suelen tener dificultades para identificar o describir emociones de primer nivel; es como intentar pintar sin pinturas.',
      };
    }

    if (pct <= 85) {
      return {
        name: 'Fuera de Foco',
        description:
          'Has capturado la esencia de las emociones primarias, pero los matices más sutiles aún se ven borrosos en tu revelado.',
      };
    }

    return {
      name: 'Obra Maestra',
      description:
        'Posees una agudeza visual y emocional digna de un critic@; logras distinguir cada tono y pincelada del círculo de las emociones.',
    };
  };

  const achievement = getAchievement(percentage);

  const handleRetryTest = () => {
    const resetQuestions = shuffleArray(getRandomQuestionsForLevel(initialLevel, 3));

    setCurrentLevel(initialLevel);
    setCurrentQuestion(0);
    setShuffledQuestions(resetQuestions);
    setAllAskedQuestions(resetQuestions);
    setAnswers({});
    setShowResults(false);
    setSelectedDescriptions({});
    setSelectedOptions({});
  };

  return (
    <div className="emotion-test-overlay">
      {showIntroModal && (
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
      
      {!showIntroModal && (
        <div className={`emotion-test-container emotion-test-container--level-${currentLevel}`}>
        {!showResults ? (
          <>
            <div className="emotion-test-header">
              <h2 className="emotion-test-level">
                Nivel {currentLevel} - Pregunta {currentQuestion + 1} de {totalQuestions}
              </h2>
              <div className="emotion-test-progress-bar">
                <div
                  className="emotion-test-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="emotion-test-question">
              <p className="emotion-test-prompt">{displayDescription}</p>
              <p className="emotion-test-select-text">¿Qué emoción es?</p>

              <div className={`emotion-test-options emotion-test-options--count-${displayOptions.length}`}>
                {displayOptions.map((option, index) => (
                  <button
                    key={index}
                    className={`emotion-test-option-button ${
                      answers[questionData.id] === option ? 'emotion-test-option-button--selected' : ''
                    }`}
                    onClick={() => handleSelectOption(option)}
                  >
                    <span className="emotion-test-option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="emotion-test-option-text">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="emotion-test-results">
            <h2 className="emotion-test-results-title">Resultados Finales</h2>
            <div className="emotion-test-score">
              <div className="emotion-test-score-circle">
                <span className="emotion-test-score-percentage">{percentage}%</span>
              </div>
              <p className="emotion-test-score-text">
                Has acertado <strong>{correctAnswers}</strong> de <strong>{totalAsked}</strong> preguntas
              </p>
            </div>

            <div className="emotion-test-achievement">
              <h3 className="emotion-test-achievement-name">{achievement.name}</h3>
              <p className="emotion-test-achievement-desc">{achievement.description}</p>
            </div>

            <div className="emotion-test-results-actions">
              <button className="emotion-test-button emotion-test-button-secondary" onClick={handleRetryTest}>
                Intentar de nuevo
              </button>
              <button className="emotion-test-button emotion-test-button-primary" onClick={handleClose}>
                Finalizar Test
              </button>
            </div>
          </div>
        )}

        <button className="emotion-test-close-button" onClick={handleClose}>
          ✕
        </button>
      </div>
      )}
    </div>
  );
}

export default EmotionTest;
