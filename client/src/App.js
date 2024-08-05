import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';


/**
 * playerName: Almacena el nombre del jugador.
 * showGame: Indica si el juego está visible o no.
 * currentQuestion: Almacena la pregunta actual del juego.
 * answerFeedback: Proporciona retroalimentación sobre las respuestas dadas (con un array inicializado con 4 cadenas vacías).
 * correctCount: Cuenta el número de respuestas correctas.
 * questionNumber: Lleva un seguimiento del número de la pregunta actual.
 * gameFinished: Indica si el juego ha terminado.
 * errorMessage: Almacena mensajes de error para mostrar al usuario.
 * showHistorial: Indica si el historial del juego está visible o no.
 * showRules: Indica si las reglas del juego están visibles o no.
 * historial: Almacena el historial de preguntas y respuestas.
 * showGameSection: Indica si la sección del juego está visible o no.
 * 
 */
function App() {
  //Estados para diferentes funciones
  const [playerName, setPlayerName] = useState('');
  const [showGame, setShowGame] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(Array(4).fill(''));
  const [correctCount, setCorrectCount] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showHistorial, setShowHistorial] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [showGameSection, setShowGameSection] = useState(true);
  //---------------------------Seccion de peteciones a DB-------------------------------------------------------------------------------------------

  //Permite enviar el nombre del usuario a la DB
  const add = () => {
    Axios.post("http://localhost:3000/create", { nombre: playerName })
      .then((response) => {
        alert("Usuario registrado app.js");
      });
  };

  //Permite obtener las preguntas y respuestas de la BD.
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
  //Estafuncion permite que las respuestas no aparezcan en un mismo lugar.
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  //Permite que al finalizar el juego enviar el nombre y la cantidad de aciertos a la DB.
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

  //Permite que el contador de las preguntas se reinicie.
  const resetQuestionCount = () => {
    Axios.put('http://localhost:3000/reset_question_count')
      .then(() => {
        console.log('Contador de preguntas reiniciado');
      })
      .catch(error => {
        console.error('Error al reiniciar el contador de preguntas:', error);
      });
  };

//Permite obtener los datos de la BD. Exactamente de la table_historial, asi mostrariamos la info del historial
  const fetchHistorial = () => {
    Axios.get('http://localhost:3000/show_historial')
      .then((response) => {
        console.log('Historial recibido:', response.data); // Log para depurar
        setHistorial(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener historial:', error);
      });
  };

//-------------------------------------Funciones auxiliares.-------------------------------------------------------------------------------------


  //Valida la entrada del nombre
  const isValidName = (name) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name) && name.trim().length > 0;
  };

  //Funcion que tare las preguntas, muestra la zona de juego, y reinicia el contador de las preguntas.
  const handleStartGame = () => {
    console.log("Juego iniciado");
    fetchQuestion();
    setShowGame(true);
    setGameFinished(false);
    resetQuestionCount();
  };
//Valida si la entrada del nombre es valida si no lanza un error.
  const handleButtonClick = () => {
    if (isValidName(playerName)) {
      add();
      handleStartGame();
    } else {
      setErrorMessage('El nombre no debe contener números ni estar vacío.');
    }
  };
  //Esta funcion se encarga de borrar el texte_fild y dejarlo vacio si detecta un error.
  const handleChange = (e) => {
    const { value } = e.target;
    if (isValidName(value)) {
      setPlayerName(value);
      setErrorMessage('');
    } else {
      setPlayerName('');
      setErrorMessage('El nombre no debe contener números ni estar vacío.');
    }
  };
  //Esta funcion es la que nos permite seleccionar una respuesta y revsisa si es la correcta o incorrecta
  const handleAnswerClick = (index, correct) => {
    const feedback = answerFeedback.slice();
    feedback[index] = correct ? 'correct' : 'incorrect';
    setAnswerFeedback(feedback);

    if (correct) {
      setCorrectCount(correctCount + 1);
    }

    setTimeout(() => {
      if (questionNumber < 9) {
        setQuestionNumber(questionNumber + 1);
        fetchQuestion();
      } else {
        setGameFinished(true);
        saveToHistorial();
      }
    }, 250);
  };
//Reinicia el juego, su contador de preguntas y todo lo relacionado.
  const resetGame = () => {
    setShowGame(false);
    setCorrectCount(0);
    setQuestionNumber(0);
    setCurrentQuestion(null);
    setGameFinished(false);
    resetQuestionCount();
  };

 //Esta funcion mostrara una estructura que se llamara cuando llegas a responder 10 preguntas.
 //Nos dice si perdimos, ganamos o empatamos.
  const renderEndGameMessage = () => {
    if (correctCount < 5) {
      return <p className="Looser_screen">Perdiste. Respuestas correctas: {correctCount}/10</p>;
    } else if (correctCount === 5) {
      return <p className="Tie_screen">Empate. Respuestas correctas: {correctCount}/10</p>;
    } else {
      return <p className="Winner_screen">¡Ganaste! Respuestas correctas: {correctCount}/10</p>;
    }
  };

  //Funcion para mostrar la info del historial.
  const showHistorialInfo = () => {
    setShowHistorial(true);
    setShowRules(false);
    setShowGameSection(false);
    fetchHistorial();
  };
  //Funcion para mostrar la info de las reglas.
  const showRulesInfo = () => {
    setShowRules(true);
    setShowHistorial(false);
    setShowGameSection(false);
  };
  //Reinicia el contador y refresca la pagina
  const handlePlayButtonClick = () => {
    resetQuestionCount();
    setTimeout(() => {
      window.location.reload();
    }, 100); // Espera 100 ms antes de recargar la página para asegurar que la función se complete
  };

  return (
    <div className="Menu_app">
      <header className="Menu_header">
        <nav className="Menu_sidebar">
          <div className="Button_play" onClick={handlePlayButtonClick}>
            Jugar
          </div>
          <div className="Button_historial" onClick={showHistorialInfo}>Historial</div>
          <div className="Button_rules" onClick={showRulesInfo}>Reglas</div>
        </nav>
        <div className="MenuWallpaper">
          <h1 className="Title_name">Preguntadas</h1>
        </div>
      </header>
      <div className="ContentMenu">
        {(!showHistorial && !showRules) && (!showGame ? (
          <div className="Name_input">
            <input
              type="text"
              placeholder="Ingresa tu nombre"
              value={playerName}
              onChange={handleChange}
            />
            <button onClick={handleButtonClick}>Jugar</button>
            {errorMessage && <div className="Error_message">{errorMessage}</div>}
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
        ))}
        {showHistorial && (
          <div className="HistorialContainer">
            <h2>Historial</h2>
            <ul className="HistorialList">
              {historial.map((entry, index) => (
                <li key={index}>
                  <span className="player-name">{entry.nombre}</span>
                  <span className="correct-count">{entry.correctas} respuestas correctas</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {showRules && (
          <div className="RulesContainer">
            <h2>Reglas</h2>
            <p className='Rules'>
              - Para ganar debes responder mínimo 6/10 preguntas correctamente. <br />
              - Si aciertas 5/10 empatarás. <br />
              - Si aciertas más de 6 ganas. <br />
              - Buena suerte usuario.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
