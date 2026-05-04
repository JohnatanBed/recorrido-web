import { useState, useMemo, useCallback } from 'react';
import { EMOTIONS_TEST } from '../constants/emotions';
import '../styles/components/emotion-test.css';

function EmotionTest({ onClose, initialLevel = 1 }) {
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedDescriptions, setSelectedDescriptions] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});

  const levels = ['level1', 'level2', 'level3'];
  const currentLevelKey = levels[currentLevel - 1];
  const questions = EMOTIONS_TEST[currentLevelKey];
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
      setShowResults(true);
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
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

  const correctAnswers = useMemo(() => {
    return questions.reduce((count, q) => {
      return count + (answers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);
  }, [answers, questions]);

  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="emotion-test-overlay">
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
            <h2 className="emotion-test-results-title">Resultados Nivel {currentLevel}</h2>
            <div className="emotion-test-score">
              <div className="emotion-test-score-circle">
                <span className="emotion-test-score-percentage">{percentage}%</span>
              </div>
              <p className="emotion-test-score-text">
                Has acertado <strong>{correctAnswers}</strong> de <strong>{totalQuestions}</strong>{' '}
                preguntas
              </p>
            </div>

            <div className="emotion-test-results-actions">
              {currentLevel < 3 ? (
                <>
                  <button className="emotion-test-button emotion-test-button-primary" onClick={handleNextLevel}>
                    Siguiente Nivel
                  </button>
                  <button className="emotion-test-button emotion-test-button-secondary" onClick={handleClose}>
                    Salir
                  </button>
                </>
              ) : (
                <button className="emotion-test-button emotion-test-button-primary" onClick={handleClose}>
                  Finalizar Test
                </button>
              )}
            </div>
          </div>
        )}

        <button className="emotion-test-close-button" onClick={handleClose}>
          ✕
        </button>
      </div>
    </div>
  );
}

export default EmotionTest;
