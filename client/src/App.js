import React, { useState, useEffect } from 'react';
import Axios from "axios";
import './App.css';
import axios from 'axios';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [showGame, setShowGame] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(Array(4).fill(''));
  const [correctCount, setCorrectCount] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [idUsuario, setIdUsuario] = useState(null);  // guarda id_usuario
  



  
  //--------------Funciones de BD------------------------------------------------------------------------------------------------------------
  /**
   * en server utilizamos node install cors
   * para evitar bloqueos de pagina.
   * Se importa en index.js pero del server
   *
   */

  //Se usa para registrar en este caso el nombre
  // Función para registrar el nombre del usuario y obtener su ID
  const add = () => {
    Axios.post("http://localhost:3000/create", { nombre: playerName })
      .then((response) => {
        alert("Usuario registrado app.js");
        setIdUsuario(response.data.id_usuario);  // Guarda el ID del usuario registrado
      });
  };

//Se encarga de obtener las preguntas y respuestas. La parte de mezclar la respuesta al azar fue sacada de chatgpt.
  const fetchQuestion = () => {
    Axios.get('http://localhost:3000/random_question')
      .then((response) => {
        if (response.data.message) {
          alert(response.data.message);
        } else {
          const fetchedQuestion = response.data;
          /**
           * Extrae la pregunta obtenida y crea un arreglo de respuestas con sus respectivos valores de corrección (true o false). 
           * Luego, mezcla las respuestas utilizando shuffleArray.
           * 
           */
         
          const answers = [
            { text: fetchedQuestion.respuesta_incorrecta_uno, correct: false },
            { text: fetchedQuestion.respuesta_incorrecta_dos, correct: false },
            { text: fetchedQuestion.respuesta_incorrecta_tres, correct: false },
            { text: fetchedQuestion.respuesta_correcta, correct: true },
          ];
            /**
           * Extrae la pregunta obtenida y crea un arreglo de respuestas con sus respectivos valores de corrección (true o false). 
           *Luego, mezcla las respuestas utilizando shuffleArray.
           * 
           */
          shuffleArray(answers);
          setCurrentQuestion({ ...fetchedQuestion, answers });
          setAnswerFeedback(Array(4).fill(''));
        }
      })
      .catch((error) => {
        console.error('ERROR: No se pudo obtener pregunta!', error);
      });
  };


/*
/*
 * Esta función mezcla el arreglo de respuestas de forma aleatoria usando 
 * el algoritmo de Fisher-Yates. Fue sacada de chatgpt
 *  
 */
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };


  //--------------Funciones de Juego-------------------------------------------------------------------------------------------------------------
  //Se incia el juego
  const handleStartGame = () => {
    console.log("Juego iniciado");
    fetchQuestion();
    setShowGame(true);
  };

  //Inicia el juego si se selecciona jugar
  const handleButtonClick = () => {
    add();
    handleStartGame();
  };

  //Mantiene el nombre del jugador en el juego
  const handleChange = (e) => {
    setPlayerName(e.target.value);
  };

 //Función para manejar clics en respuestas:
 const handleAnswerClick = (index, correct) => {
  const feedback = answerFeedback.slice();
  feedback[index] = correct ? 'correct' : 'incorrect';
  setAnswerFeedback(feedback);

  if (correct) {
    setCorrectCount(correctCount + 1);
  }

  setTimeout(() => {
    if (questionNumber < 10) {
      setQuestionNumber(questionNumber + 1);
      fetchQuestion();
    } else {
      alert(`Juego terminado. Respuestas correctas: ${correctCount}`);
      saveToHistorial();
      resetGame();
    }
  }, 250);
};





const saveToHistorial = () => {
  Axios.post('http://localhost:3000/add_to_historial', {
    nombre: playerName,  // Enviar el nombre del jugador
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
