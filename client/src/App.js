import React, { useState, useEffect } from 'react';
import Axios from "axios";
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [showGame, setShowGame] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(Array(4).fill(''));
  const [correctCount, setCorrectCount] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [gameFinished, setGameFinished] = useState(false); // Nuevo estado para manejar la pantalla de finalización
  const [errorMessage, setErrorMessage] = useState('');//Muestra error si lo hay

  // Función para registrar el nombre del usuario y obtener su ID
  const add = () => {
    Axios.post("http://localhost:3000/create", { nombre: playerName })
      .then((response) => {
        alert("Usuario registrado app.js");
      });
  }; 

  //Valida la entrada del nombre
  const isValidName = (name) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name) && name.trim().length > 0;
  };
  

  // Función para obtener una pregunta aleatoria
  const fetchQuestion = () => {
    Axios.get('http://localhost:3000/random_question')
      .then((response) => {
        if (response.data.message) {
          alert(response.data.message);
        } else {
          const fetchedQuestion = response.data;
          const answers = [
            { text: fetchedQuestion.respuesta_incorrecta_uno, correct: false },
            { text: fetchedQuestion.respuesta_incorrecta_dos, correct: false },
            { text: fetchedQuestion.respuesta_incorrecta_tres, correct: false },
            { text: fetchedQuestion.respuesta_correcta, correct: true },
          ];
          shuffleArray(answers);
          setCurrentQuestion({ ...fetchedQuestion, answers });
          setAnswerFeedback(Array(4).fill(''));
        }
      })
      .catch((error) => {
        console.error('ERROR: No se pudo obtener pregunta!', error);
      });
  };

  // Función para mezclar las respuestas
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Función para iniciar el juego
  const handleStartGame = () => {
    console.log("Juego iniciado");
    fetchQuestion();
    setShowGame(true);
    setGameFinished(false);
     resetQuestionCount(); // Reinicia el contador al iniciar el juego
  };

  // Función que combina iniciar juego y registrar nombre
  const handleButtonClick = () => {
    add();
    handleStartGame();
  };

  // Función para manejar cambios en el input de nombre
  const handleChange = (e) => {
    const { value } = e.target;
    if (isValidName(value)) {
      setPlayerName(value);
      setErrorMessage(''); // Limpia el mensaje de error si el nombre es válido
    } else {
      setPlayerName('');
      setErrorMessage('El nombre no debe contener números ni estar vacío.');
    }
  };

  // Función para manejar clics en las respuestas
  const handleAnswerClick = (index, correct) => {
    const feedback = answerFeedback.slice();
    feedback[index] = correct ? 'correct' : 'incorrect';
    setAnswerFeedback(feedback);

    if (correct) {
      setCorrectCount(correctCount + 1);
    }

    setTimeout(() => {
      if (questionNumber < 9) { // Ajusta para permitir 10 preguntas
        setQuestionNumber(questionNumber + 1);
        fetchQuestion();
      } else {
        setGameFinished(true);
        saveToHistorial();
      }
    }, 250);
  };

  // Función para guardar el historial
  const saveToHistorial = () => {
    Axios.post('http://localhost:3000/add_to_historial', {
      nombre: playerName,
      correctas: correctCount,
    })
      .then(() => {
        console.log('Historial actualizado');
      })
      .catch(error => {
        console.error('Error al actualizar el historial:', error);
      });
  };

  // Función para reiniciar el juego
  const resetGame = () => {
    setShowGame(false);
    setCorrectCount(0);
    setQuestionNumber(0);
    setCurrentQuestion(null);
    setGameFinished(false);
    resetQuestionCount(); // Reinicia el contador al resetear el juego
  };



  //Permite que se reinicie el contador de preguntas.
  const resetQuestionCount = () => {
    Axios.put('http://localhost:3000/reset_question_count')
      .then(() => {
        console.log('Contador de preguntas reiniciado');
      })
      .catch(error => {
        console.error('Error al reiniciar el contador de preguntas:', error);
      });
  };
  
  // Renderiza el mensaje de finalización del juego basado en el número de respuestas correctas
  // Renderiza el mensaje de finalización del juego basado en el número de respuestas correctas
const renderEndGameMessage = () => {
  if (correctCount < 5) {
    return <p className="Looser_screen">Perdiste. Respuestas correctas: {correctCount}/10</p>;
  } else if (correctCount === 5) {
    return <p className="Tie_screen">Empate. Respuestas correctas: {correctCount}/10</p>;
  } else {
    return <p className="Winner_screen">¡Ganaste! Respuestas correctas: {correctCount}/10</p>;
  }
};
  return (
    <div className="Menu_app">
      <header className="Menu_header">
        <nav className="Menu_sidebar">
          <div className="Button_play" onClick={handleButtonClick}>
            Jugar
          </div>
          <div className="Button_historial">Historial</div>
          <div className="Button_rules">Reglas</div>
        </nav>
        <div className="MenuWallpaper">
          <h1 className="Title_name">Preguntadas</h1>
        </div>
      </header>
      <div className="ContentMenu">
        {!showGame ? (
          <div className="Name_input">

            <input
              type="text"
              placeholder="Ingresa tu nombre"
              value={playerName}
              onChange={handleChange}
            />
            <button onClick={handleButtonClick}>Jugar</button>
          </div>
        ) : gameFinished ? (
          <div className="EndGameScreen">
  <div className="EndGameMessage">
    {renderEndGameMessage()}
  </div>
  <div className="EndGameButtonContainer">
    <button className="Reset_game" onClick={resetGame}>Jugar de nuevo</button>
  </div>
</div>
        ) : (
          <>
            <div className="Name_bar">Jugador: {playerName}</div>
            <div className="ContentMenu_play">
              {currentQuestion ? (
                <>
                  <div className="Bar_questions">
                    <p>{currentQuestion.pregunta}</p>
                  </div>
                  <div className="ResponseContainer">
                    {currentQuestion.answers.map((answer, index) => (
                      <div
                        key={index}
                        className={`ResponseButton ${answerFeedback[index]}`}
                        onClick={() => handleAnswerClick(index, answer.correct)}
                      >
                        {answer.text}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>Cargando preguntas...</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
