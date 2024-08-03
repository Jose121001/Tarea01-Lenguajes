import React, { useState } from 'react';
import Axios from "axios";
import './App.css';


function App() {
  const [playerName, setPlayerName] = useState("");
  const [showGame, setShowGame] = useState(false);
  const [questions, setQuestions] = useState([]);

  //--------------Funciones de BD------------------------------------------------------------------------------------------------------------
  /**
   * en server utilizamos node install cors
   * para evitar bloqueos de pagina.
   * Se importa en index.js pero del server
   *
   */
  const [nombre, setNombre] = useState("");

  //Se usa para registrar en este caso el nombre
  const add = () => {
    Axios.post("http://localhost:3000/create", {
      nombre: nombre,
    }).then(() => {
      alert("Usuario registrado app.js");
    });
  };

  //Se encarga de obtener las preguntas y respuestas
  const fetchQuestion = () => {
    Axios.get("http://localhost:3000/random_question")
      .then((response) => {
        if (response.data.message) {
          alert(response.data.message);
        } else {
          setQuestions([response.data]);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the question!", error);
      });
  };

  //--------------Funciones de Juego-------------------------------------------------------------------------------------------------------------
  //Se incia el juego
  const handleStartGame = () => {
    console.log("Juego iniciado");
    fetchQuestion();
    setShowGame(true); // Cambia el estado para mostrar el juego
  };

  //Funcion que fuciona el handler y el add
  const handleButtonClick = () => {
    add();
    handleStartGame();
  };
  //Combina el setPlayer y agrega el setNomre para el add
  const handleChange = (e) => {
    setPlayerName(e.target.value);
    setNombre(e.target.value);
  };
  //-------------Fin de Funciones de Juego------------------------------------------------------------------------------------------------------------------------------------------

  //Estructura del Front usando react.

 
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
              {questions.length > 0 ? (
                <>
                  <div className="Bar_questions">
                    <p>{questions[0].pregunta}</p>
                  </div>
                  <div className="ResponseContainer">
                    <div className="ResponseButton">
                      {questions[0].respuesta_incorrecta_uno}
                    </div>
                    <div className="ResponseButton">
                      {questions[0].respuesta_incorrecta_dos}
                    </div>
                    <div className="ResponseButton">
                      {questions[0].respuesta_incorrecta_tres}
                    </div>
                    <div className="ResponseButton">
                      {questions[0].respuesta_correcta}
                    </div>
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
